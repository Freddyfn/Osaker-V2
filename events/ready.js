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

        // Eventos de Riffy para saber qué está pasando con la música
        client.riffy.on("nodeConnect", node => {
            console.log(`🎵 Nodo de Lavalink "${node.name}" conectado.`);
        });

        client.riffy.on("nodeError", (node, error) => {
            console.error(`❌ El nodo "${node.name}" encontró un error: ${error.message}`);
        });

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
            // Opcional: Desconectar el bot después de un tiempo de inactividad
            setTimeout(() => {
                if (player.queue.size === 0) {
                    player.destroy();
                }
            }, 120000); // 1 minuto
        });
    },
};