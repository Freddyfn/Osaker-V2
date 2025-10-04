module.exports = {
    name: 'skip',
    description: 'Salta a la siguiente canción.',
    aliases: ['s'],
    execute(message, args, client) {
        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.reply("No hay nada reproduciéndose.");

        if (player.queue.size === 0) return message.reply("No hay más canciones en la cola.");

        player.stop();
        message.channel.send("⏭️ Canción saltada.");
    },
};