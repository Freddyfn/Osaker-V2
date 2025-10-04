# Osaker V2 - Bot de Música Híbrido para Discord

¡Un bot de música simple y potente para tu servidor de Discord, construido con **discord.js v14** y **Lavalink**! Osaker V2 es compatible tanto con los comandos de barra (`/`) modernos como con los comandos de prefijo (`?`) clásicos, ofreciendo una experiencia musical de alta calidad para todos los usuarios.

## ✨ Características

-   **Sistema de Comandos Híbrido**: Usa los comandos de la forma que prefieras, ya sea con el prefijo `?` o con los comandos de barra `/`.
-   **Reproducción de Alta Calidad**: Gracias a Lavalink, la música se transmite de forma fluida y sin interrupciones.
-   **Soporte Multi-fuente**: Reproduce canciones y playlists desde **YouTube** y **Spotify** usando enlaces o simplemente buscando el nombre.
-   **Fácil de Desplegar**: Listo para ser alojado en plataformas como Render, con registro automático de comandos.
-   **Ligero y Rápido**: Enfocado exclusivamente en la música para un rendimiento óptimo.

---

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el bot en tu propia máquina para desarrollo.

### **Requisitos Previos**

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   Un servidor de [Lavalink](https://github.com/lavalink-devs/Lavalink) disponible (público o local).

### **Instalación**

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/Freddyfn/Osaker-V2.git](https://github.com/Freddyfn/Osaker-V2.git)
    cd Osaker-V2
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo llamado `.env` en la raíz del proyecto y añade las siguientes credenciales. **¡No compartas este archivo con nadie!**

    ```env
    # Token y Client ID de tu bot de Discord
    TOKEN=TU_TOKEN_DE_DISCORD_AQUÍ
    CLIENT_ID=EL_ID_DE_APLICACIÓN_DE_TU_BOT

    # Credenciales de tu servidor Lavalink
    LAVALINK_HOST=tu_host_de_lavalink.com
    LAVALINK_PORT=443
    LAVALINK_PASSWORD=tu_contraseña_de_lavalink
    LAVALINK_SECURE=true
    ```

4.  **Registra los Comandos de Barra (`/`):**
    Este es un paso que solo necesitas hacer una vez, o cada vez que modifiques los comandos.
    ```bash
    node deploy-commands.js
    ```

5.  **Inicia el bot:**
    ```bash
    node index.js
    ```
    Si todo está configurado correctamente, verás un mensaje en la consola indicando que el bot está en línea y conectado a Lavalink.

---

## 🎶 Comandos

Puedes usar los comandos con el prefijo `?` o con la barra `/`.

| Comando       | Alias | Descripción                                       |
| ------------- | ----- | ------------------------------------------------- |
| `/play` ó `?play` | `p` | Reproduce una canción o la añade a la cola.       |
| `/stop` ó `?stop` | `leave` | Detiene la reproducción y limpia la cola.         |
| `/skip` ó `?skip` | `s` | Salta a la siguiente canción en la cola.          |
| `/queue` ó `?queue` | `q` | Muestra la lista de canciones en espera.          |
| `/help` ó `?help` | `h` | Muestra este mensaje de ayuda.                    |

### **Ejemplos de Uso**

-   `/play song:Sicko Mode`
-   `?play Sicko Mode`
-   `?p https://www.youtube.com/watch?v=...`
-   `/skip` ó `?skip`

---

## ☁️ Despliegue (Deployment)

Este bot está preparado para ser desplegado en servicios de hosting como [Render](https://render.com/).

1.  **Sube tu código a GitHub.**
2.  Crea un nuevo **"Web Service"** en Render y conéctalo a tu repositorio.
3.  Usa la siguiente configuración en los ajustes del servicio:
    -   **Runtime:** `Node`
    -   **Build Command:** `npm install && node deploy-commands.js`
    -   **Start Command:** `node index.js`
4.  Añade tus variables de entorno (`TOKEN`, `CLIENT_ID`, `LAVALINK_HOST`, etc.) en la pestaña **"Environment"** de Render. **Nunca subas tu archivo `.env`**.
5.  ¡Despliega! Render instalará las dependencias, registrará los comandos y iniciará el bot automáticamente.
