const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    // Para slash commands (/)
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Muestra la cola de canciones.'),
    // Para prefix commands (?)
    name: 'queue',
    aliases: ['q'],

    async execute(context, client) {
        const isInteraction = context.isChatInputCommand ? context.isChatInputCommand() : false;
        const guildId = context.guild.id;

        const player = client.riffy.players.get(guildId);
        if (!player || player.queue.size === 0) {
            const reply = "La cola está vacía.";
            return isInteraction ? context.reply({ content: reply, ephemeral: true }) : context.reply(reply);
        }

        const queue = player.queue.map((track, index) => {
            const requester = track.info.requester || "Desconocido";
            return `${index + 1}. [${track.info.title}](${track.info.uri}) - Solicitado por: ${requester}`;
        });
        
        const embed = new EmbedBuilder()
            .setColor("#2b71ec")
            .setTitle("📜 Cola de Reproducción")
            .setDescription(queue.slice(0, 10).join('\n')) // Muestra las primeras 10 canciones
            .setFooter({ text: `Total de canciones en la cola: ${player.queue.size}` });

        return isInteraction ? context.reply({ embeds: [embed] }) : context.channel.send({ embeds: [embed] });
    },
};