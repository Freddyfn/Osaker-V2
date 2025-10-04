const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Reproduce una canción de YouTube o Spotify.',
    aliases: ['p'],
    async execute(message, args, client) {
        const query = args.join(" ");
        if (!query) return message.reply("Por favor, proporciona el nombre o el enlace de una canción.");

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply("¡Necesitas estar en un canal de voz para reproducir música!");

        try {
            const player = client.riffy.createConnection({
                guildId: message.guild.id,
                voiceChannel: voiceChannel.id,
                textChannel: message.channel.id,
                deaf: true
            });

            const resolve = await client.riffy.resolve({ query: query, requester: message.author });
            const { loadType, tracks, playlistInfo } = resolve;

            if (loadType === 'playlist') {
                for (const track of tracks) {
                    player.queue.add(track);
                }
                message.channel.send(`🎶 **${tracks.length}** canciones de la playlist **${playlistInfo.name}** han sido añadidas a la cola.`);
                if (!player.playing && !player.paused) player.play();

            } else if (loadType === 'search' || loadType === 'track') {
                const track = tracks.shift();
                player.queue.add(track);
                message.channel.send(`✅ **${track.info.title}** ha sido añadido a la cola.`);
                if (!player.playing && !player.paused) player.play();

            } else {
                return message.channel.send('❌ No se encontraron resultados.');
            }
        } catch (error) {
            console.error("Error en el comando play:", error);
            message.reply("❌ Ocurrió un error al intentar reproducir la canción.");
        }
    },
};