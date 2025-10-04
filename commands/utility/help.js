const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { prefix } = require('../../config.js');

module.exports = {
    // Para slash commands (/)
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Muestra una lista de todos los comandos disponibles.'),
    // Para prefix commands (?)
    name: 'help',
    aliases: ['h'],

    async execute(context, client) {
        const isInteraction = context.isChatInputCommand ? context.isChatInputCommand() : false;

        const commandList = client.commands
            .map(cmd => {
                // Usa el nombre del slash command si existe, si no, el nombre del comando de prefijo
                const name = cmd.data ? cmd.data.name : cmd.name;
                const description = cmd.data ? cmd.data.description : cmd.description || "Sin descripción.";
                return `**/${name}** ó **${prefix}${name}**: ${description}`;
            })
            .join('\n');

        const embed = new EmbedBuilder()
            .setColor('#2b71ec')
            .setTitle('🤖 Comandos del Bot')
            .setDescription('Aquí tienes todos los comandos disponibles. Puedes usarlos con `/` o con el prefijo `?`.')
            .addFields({ name: '🎶 Comandos', value: commandList });

        return isInteraction ? context.reply({ embeds: [embed] }) : context.channel.send({ embeds: [embed] });
    },
};