// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
    throw new Error("¡El TOKEN y el CLIENT_ID deben estar en tu archivo .env!");
}

const commands = [];
// Cargar todos los archivos de comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[ADVERTENCIA] Al comando en ${filePath} le falta una propiedad "data" o "execute" requerida.`);
        }
    }
}

// Construir e instanciar el módulo REST
const rest = new REST().setToken(TOKEN);

// Desplegar los comandos
(async () => {
    try {
        console.log(`Empezando a refrescar ${commands.length} comandos de barra (/) de la aplicación.`);

        // El método 'put' sincroniza completamente los comandos con los actuales
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Se recargaron exitosamente ${data.length} comandos de barra (/) de la aplicación.`);
    } catch (error) {
        console.error(error);
    }
})();