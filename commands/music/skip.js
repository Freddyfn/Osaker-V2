const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Para slash commands (/)
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Salta a la siguiente canción en la cola.'),
    // Para prefix commands (?)
    name: 'skip',
    aliases: ['s'],
    
    async execute(context, client) {
        const isInteraction = context.isChatInputCommand ? context.isChatInputCommand() : false;
        const guildId = context.guild.id;

        const player = client.riffy.players.get(guildId);
        if (!player) {
            const reply = "No hay nada reproduciéndose.";
            return isInteraction ? context.reply({ content: reply, ephemeral: true }) : context.reply(reply);
        }

        if (player.queue.size === 0) {
            const reply = "No hay más canciones en la cola para saltar.";
            return isInteraction ? context.reply({ content: reply, ephemeral: true }) : context.reply(reply);
        }

        player.stop();
        const reply = "⏭️ Canción saltada.";
        return isInteraction ? context.reply(reply) : context.channel.send(reply);
    },
};