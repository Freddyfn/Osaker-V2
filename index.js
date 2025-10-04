require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { Riffy } = require("riffy");
const express = require('express');
const { prefix } = require('./config.js');

// Servidor web para UptimeRobot y Render
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('¡El bot está vivo!'));
app.listen(port, () => console.log(`Servidor web escuchando en el puerto ${port}`));

// Cliente de Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Configuración de Riffy (Lavalink)
const nodes = [{
    host: process.env.LAVALINK_HOST,
    password: process.env.LAVALINK_PASSWORD,
    port: parseInt(process.env.LAVALINK_PORT),
    secure: process.env.LAVALINK_SECURE === 'true',
}];

client.riffy = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytsearch",
    restVersion: "v4"
});

// --- Cargador de Comandos ---
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if ('name' in command && 'execute' in command) {
            client.commands.set(command.name, command);
        } else {
            console.log(`[ADVERTENCIA] Al comando en ${filePath} le falta una propiedad "name" o "execute".`);
        }
    }
}

// --- Cargador de Eventos ---
const eventsPath = path.join(__dirname, 'events');
// Comprueba si la carpeta 'events' existe antes de intentar leerla
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
} else {
    console.log("[ADVERTENCIA] No se encontró la carpeta 'events'. Asegúrate de crearla si tienes eventos como 'ready.js'.")
}


// --- Escuchador de Mensajes ---
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(`Error en el comando ${commandName}:`, error);
        message.reply('❌ Ocurrió un error al intentar ejecutar ese comando.');
    }
});

// --- Manejador RAW para el Audio de Lavalink ---
client.on("raw", (d) => {
    client.riffy.updateVoiceState(d);
});

// --- Iniciar sesión ---
client.login(process.env.TOKEN);