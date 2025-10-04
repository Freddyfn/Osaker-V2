// freddyfn/osaker-v2/Osaker-V2-a42335b59dc7261e0102d104f4969c6f23f3643b/commands/utility/help.js

const { EmbedBuilder } = require('discord.js');
const { prefix } = require('../../config.js');

module.exports = {
    name: 'help',
    description: 'Muestra una lista de comandos.',
    aliases: ['h'],
    execute(message, args, client) {
        const musicCommands = client.commands
            .filter(cmd => cmd.name !== 'help' && cmd.description) 
            .map(cmd => `**${prefix}${cmd.name}**: ${cmd.description}`)
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('#2b71ec')
            .setTitle('🤖 Comandos del Bot')
            .setDescription('Aquí tienes todos los comandos disponibles:')
            .addFields(
                { name: '🎶 Música', value: musicCommands || 'No hay comandos de música para mostrar.' }
            );

        message.channel.send({ embeds: [embed] });
    },
};