const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Detiene la música y desconecta el bot.'),
    name: 'stop',
    aliases: ['leave', 'disconnect'],
    async execute(context, client) {
        const isInteraction = context.isChatInputCommand ? context.isChatInputCommand() : false;
        const guildId = context.guild.id;

        const player = client.riffy.players.get(guildId);
        if (!player) {
            const reply = "No hay nada reproduciéndose.";
            return isInteraction ? context.reply({ content: reply, ephemeral: true }) : context.reply(reply);
        }
        
        player.destroy();
        const reply = "⏹️ La música se ha detenido y me he desconectado.";
        return isInteraction ? context.reply(reply) : context.channel.send(reply);
    },
};