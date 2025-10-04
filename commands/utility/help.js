const { EmbedBuilder } = require('discord.js');
const { prefix } = require('../../config.json');

module.exports = {
    name: 'help',
    description: 'Muestra una lista de comandos.',
    aliases: ['h'],
    execute(message, args, client) {
        const musicCommands = client.commands
            .filter(cmd => cmd.name !== 'help')
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