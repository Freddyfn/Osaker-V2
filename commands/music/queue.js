const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'queue',
    description: 'Muestra la cola de canciones.',
    aliases: ['q'],
    execute(message, args, client) {
        const player = client.riffy.players.get(message.guild.id);
        if (!player || player.queue.size === 0) {
            return message.reply("La cola está vacía.");
        }

        const queue = player.queue.map((track, index) => `${index + 1}. [${track.info.title}](${track.info.uri}) - ${track.info.requester}`);
        
        const embed = new EmbedBuilder()
            .setColor("#2b71ec")
            .setTitle("📜 Cola de Reproducción")
            .setDescription(queue.slice(0, 10).join('\n')) // Muestra las primeras 10 canciones
            .setFooter({ text: `Total de canciones: ${player.queue.size}` });

        message.channel.send({ embeds: [embed] });
    },
};