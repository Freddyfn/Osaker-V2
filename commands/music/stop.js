module.exports = {
    name: 'stop',
    description: 'Detiene la música y desconecta el bot.',
    aliases: ['leave', 'disconnect'],
    execute(message, args, client) {
        const player = client.riffy.players.get(message.guild.id);
        if (!player) return message.reply("No hay nada reproduciéndose.");
        
        player.destroy();
        message.channel.send("⏹️ La música se ha detenido y me he desconectado.");
    },
};