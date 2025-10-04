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
    secure: process.env.LAVALINK_SECURE === 'true', // Convierte string a booleano
}];

client.riffy = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4"
});

// --- Cargadores de Comandos y Eventos (No necesitan cambios) ---
client.commands = new Collection();
// ... (El código del cargador de comandos y eventos de la respuesta anterior va aquí) ...

// --- Iniciar sesión ---
client.login(process.env.TOKEN);