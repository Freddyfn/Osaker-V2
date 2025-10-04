// freddyfn/osaker-v2/Osaker-V2-a42335b59dc7261e0102d104f4969c6f23f3643b/commands/utility/help.js

const { EmbedBuilder } = require('discord.js');
const { prefix } = require('../../config.js'); // <-- Corregido de .json a .js

module.exports = {
    name: 'help',
    description: 'Muestra una lista de comandos.',
    aliases: ['h'],
    execute(message, args, client) {
        // Obtenemos los comandos de la colección y los formateamos
        const musicCommands = client.commands
            .filter(cmd => cmd.name !== 'help') // Excluimos el propio comando de ayuda
            .map(cmd => `**${prefix}${cmd.name}**: ${cmd.description}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('#2b71ec')
            .setTitle('🤖 Comandos del Bot')
            .setDescription('Aquí tienes todos los comandos disponibles:')
            .addFields(
                { name: '🎶 Música', value: musicCommands }
            );

        message.channel.send({ embeds: [embed] });
    },
};