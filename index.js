// index.js

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { Riffy } = require("riffy");
const express = require('express');
const { prefix } = require('./config.js');

// Servidor web para UptimeRobot
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

// --- Cargador de Comandos Universal ---
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        // Registra el comando usando su nombre de slash command o el nombre de prefijo
        const commandName = command.data ? command.data.name : command.name;
        if (commandName) {
            client.commands.set(commandName, command);
        }
    }
}

// --- Cargador de Eventos ---
const eventsPath = path.join(__dirname, 'events');
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
}

// --- Escuchador de Interacciones (Para Slash Commands /) ---
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
        } else {
            await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
        }
    }
});

// --- Escuchador de Mensajes (Para Prefijos ?) ---
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    // Busca el comando por su nombre o alias
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        await command.execute(message, client, args); // Pasamos los args al final
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