const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Para slash commands (/)
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción o playlist.')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('El nombre o URL de la canción.')
                .setRequired(true)),
    // Para prefix commands (?)
    name: 'play',
    aliases: ['p'],
    
    async execute(context, client, args) {
        const isInteraction = context.isChatInputCommand ? context.isChatInputCommand() : false;
        
        const query = isInteraction ? context.options.getString('song') : args.join(" ");
        const voiceChannel = context.member.voice.channel;
        
        if (!voiceChannel) {
            const reply = "¡Necesitas estar en un canal de voz para reproducir música!";
            return isInteraction ? context.reply({ content: reply, ephemeral: true }) : context.reply(reply);
        }
        
        if (!query) {
            const reply = "Por favor, proporciona el nombre o el enlace de una canción.";
            return isInteraction ? context.reply({ content: reply, ephemeral: true }) : context.reply(reply);
        }

        if (isInteraction) await context.deferReply();

        try {
            const player = client.riffy.createConnection({
                guildId: context.guild.id,
                voiceChannel: voiceChannel.id,
                textChannel: context.channel.id,
                deaf: true
            });

            const requester = isInteraction ? context.user : context.author;
            const resolve = await client.riffy.resolve({ query: query, requester: requester });
            const { loadType, tracks, playlistInfo } = resolve;
            
            let replyMessage = '';

            if (loadType === 'playlist') {
                for (const track of tracks) player.queue.add(track);
                replyMessage = `🎶 **${tracks.length}** canciones de **${playlistInfo.name}** han sido añadidas a la cola.`;
                if (!player.playing && !player.paused) player.play();
            } else if (loadType === 'search' || loadType === 'track') {
                const track = tracks.shift();
                player.queue.add(track);
                replyMessage = `✅ **${track.info.title}** ha sido añadido a la cola.`;
                if (!player.playing && !player.paused) player.play();
            } else {
                replyMessage = '❌ No se encontraron resultados.';
            }
            
            return isInteraction ? context.editReply(replyMessage) : context.channel.send(replyMessage);

        } catch (error) {
            console.error("Error en el comando play:", error);
            const errorReply = "❌ Ocurrió un error al intentar reproducir la canción.";
            return isInteraction ? context.editReply(errorReply) : context.reply(errorReply);
        }
    },
};