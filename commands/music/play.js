// commands/music/play.js

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

            if (loadType === 'error') {
                console.error("Error de Lavalink al resolver la pista:", resolve.error);
                replyMessage = '❌ Ocurrió un error al buscar la canción. El servicio de música podría estar temporalmente caído.';
            
            } else if (loadType === 'playlist') {
                
                // <<< INICIO DEL CAMBIO: Cancelar temporizador de inactividad >>>
                if (player.disconnectTimeout) {
                    clearTimeout(player.disconnectTimeout);
                    player.disconnectTimeout = null;
                }
                // <<< FIN DEL CAMBIO >>>

                for (const track of tracks) player.queue.add(track);
                replyMessage = `🎶 **${tracks.length}** canciones de **${playlistInfo.name}** han sido añadidas a la cola.`;
                if (!player.playing && !player.paused) player.play();

            } else if (loadType === 'search' || loadType === 'track') {
                
                // <<< INICIO DEL CAMBIO: Cancelar temporizador de inactividad >>>
                if (player.disconnectTimeout) {
                    clearTimeout(player.disconnectTimeout);
                    player.disconnectTimeout = null;
                }
                // <<< FIN DEL CAMBIO >>>

                const track = tracks.shift();
                player.queue.add(track);
                replyMessage = `✅ **${track.info.title}** ha sido añadido a la cola.`;
                if (!player.playing && !player.paused) player.play();
            
            } else { // Esto cubre el caso 'empty'
                replyMessage = '❌ No se encontraron resultados.';
            }
            
            return isInteraction ? context.editReply(replyMessage) : context.channel.send(replyMessage);

        } catch (error) {
            console.error("Error en el comando play:", error);

            // <<< INICIO DE LA SOLUCIÓN: Reconexión de Lavalink >>>
            try {
                console.warn("Error en 'play', se detectó un posible problema con Lavalink. Intentando reconectar Riffy...");
                // Forzamos a Riffy a reinicializar sus conexiones con los nodos
                // Esto utiliza la configuración ya cargada en index.js
                client.riffy.init(client.user.id); 
                console.log("Intento de reconexión de Riffy enviado.");
            } catch (reconError) {
                console.error("Error crítico al intentar *reconectar* Riffy:", reconError);
            }
            // <<< FIN DE LA SOLUCIÓN >>>

            // Mensaje modificado para el usuario
            const errorReply = "❌ Ocurrió un error inesperado. Se está intentando reconectar el servicio de música. Por favor, intenta tu comando de nuevo en unos segundos.";
            
            return isInteraction ? (context.deferred ? context.editReply(errorReply) : context.reply({ content: errorReply, ephemeral: true })) : context.reply(errorReply);
        }
    },
};