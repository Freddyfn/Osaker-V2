// events/ready.js

const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true, // Este evento solo debe ejecutarse una vez
    execute(client) {
        console.log(`✅ ¡Listo! Conectado como ${client.user.tag}`);

        // --- INICIALIZACIÓN DE RIFFY (LA SOLUCIÓN) ---
        // Esto le dice a Riffy que se conecte a Lavalink ahora que el bot está en línea.
        client.riffy.init(client.user.id);

        // Establecer la presencia del bot
        client.user.setPresence({
            activities: [{ name: `música | ?help`, type: ActivityType.Listening }],
            status: 'online',
        });

        // --- EVENTOS DE RIFFY MEJORADOS PARA DIAGNÓSTICO ---
        client.riffy.on("nodeConnect", node => {
            console.log(`🎵 Nodo de Lavalink "${node.name}" conectado.`);
        });

        client.riffy.on("nodeError", (node, error) => {
            console.error(`❌ El nodo "${node.name}" encontró un error: ${error.message}`);
        });

        // <<< CAMBIO: AÑADIDO PARA DETECTAR DESCONEXIONES >>>
        client.riffy.on("nodeDisconnect", node => {
            console.warn(`🔌 El nodo "${node.name}" se ha desconectado. Revisa el estado del servidor Lavalink.`);
        });
        
        // <<< CAMBIO: AÑADIDO PARA VER INTENTOS DE RECONEXIÓN >>>
        client.riffy.on("nodeReconnect", node => {
            console.info(`🔄 Intentando reconectar al nodo "${node.name}".`);
        });
        // --- FIN DE LOS EVENTOS MEJORADOS ---

        client.riffy.on("trackStart", async (player, track) => {
            const channel = client.channels.cache.get(player.textChannel);
            if (channel) {
                channel.send(`▶️ Ahora reproduciendo: **${track.info.title}**`);
            }
        });

        client.riffy.on("queueEnd", async (player) => {
            const channel = client.channels.cache.get(player.textChannel);
            if (channel) {
                channel.send("✅ La cola ha terminado. ¡No hay más canciones para reproducir!");
            }

            // <<< INICIO DEL CAMBIO: Guardar el temporizador de desconexión >>>

            // Limpia cualquier temporizador anterior que pudiera existir por seguridad
            if (player.disconnectTimeout) {
                clearTimeout(player.disconnectTimeout);
            }

            // Opcional: Desconectar el bot después de un tiempo de inactividad
            player.disconnectTimeout = setTimeout(() => {
                if (player.queue.size === 0) {
                    player.destroy();
                }
                // Limpia la referencia al temporizador una vez ejecutado
                player.disconnectTimeout = null; 
            }, 120000); // 2 minutos
            
            // <<< FIN DEL CAMBIO >>>
        });
    },
};