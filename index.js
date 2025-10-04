// freddyfn/osaker-v2/Osaker-V2-a42335b59dc7261e0102d104f4969c6f23f3643b/index.js

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { Riffy } = require("riffy");
const express = require('express');

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
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4"
});


// --- ✅ INICIO DEL CÓDIGO FALTANTE ---

// Cargador de Comandos
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

// Cargador de Eventos (Si decides usarlos en el futuro)
// Por ahora, el manejo de mensajes está en messageCreate, pero esta es la estructura correcta.
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


// --- Iniciar sesión ---
client.login(process.env.TOKEN);