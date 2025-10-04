# Osaker V2 - Bot de Música para Discord

¡Un bot de música simple y potente para tu servidor de Discord, construido con **discord.js v14** y **Lavalink**! Osaker V2 está diseñado para ser ligero, fácil de usar y ofrecer una experiencia musical de alta calidad.



## ✨ Características

-   **Reproducción de Alta Calidad**: Gracias a Lavalink, la música se transmite de forma fluida y sin interrupciones.
-   **Soporte Multi-fuente**: Reproduce canciones y playlists desde **YouTube** y **Spotify** usando enlaces o simplemente buscando el nombre.
-   **Gestión de Cola**: Añade canciones, visualiza la cola, salta a la siguiente y mucho más.
-   **Fácil de Desplegar**: Listo para ser alojado en plataformas como Render.
-   **Ligero y Rápido**: Enfocado exclusivamente en la música para un rendimiento óptimo.

---

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el bot en tu propia máquina para desarrollo.

### **Requisitos Previos**

-   [Node.js](https://nodejs.org/) (versión 18 o superior)
-   Un servidor de [Lavalink](https://github.com/lavalink-devs/Lavalink) disponible (puedes usar uno público o configurar el tuyo).

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
    # Token de tu bot de Discord
    TOKEN=TU_TOKEN_DE_DISCORD_AQUÍ

    # Credenciales de tu servidor Lavalink
    LAVALINK_HOST=tu_host_de_lavalink.com
    LAVALINK_PORT=443
    LAVALINK_PASSWORD=tu_contraseña_de_lavalink
    LAVALINK_SECURE=true
    ```

4.  **Inicia el bot:**
    ```bash
    node index.js
    ```
    Si todo está configurado correctamente, verás un mensaje en la consola indicando que el bot está en línea y conectado a Lavalink.

---

## 🎶 Comandos

El prefijo por defecto es `?`.

| Comando       | Alias | Descripción                                       |
| ------------- | ----- | ------------------------------------------------- |
| `?play`       | `p`   | Reproduce una canción o la añade a la cola.       |
| `?stop`       | `leave` | Detiene la reproducción y limpia la cola.         |
| `?skip`       | `s`   | Salta a la siguiente canción en la cola.          |
| `?queue`      | `q`   | Muestra la lista de canciones en espera.          |
| `?help`       | `h`   | Muestra este mensaje de ayuda.                    |

### **Ejemplos de Uso**

-   `?play Sicko Mode`
-   `?p https://www.youtube.com/watch?v=...`
-   `?skip`
-   `?q`

---

## ☁️ Despliegue (Deployment)

Este bot está preparado para ser desplegado en servicios de hosting como [Render](https://render.com/).

1.  **Sube tu código a GitHub.**
2.  Crea un nuevo **"Web Service"** en Render y conéctalo a tu repositorio.
3.  Usa la siguiente configuración:
    -   **Runtime:** `Node`
    -   **Build Command:** `npm install`
    -   **Start Command:** `node index.js`
4.  Añade tus variables de entorno (`TOKEN`, `LAVALINK_HOST`, etc.) en la pestaña **"Environment"** de Render.
5.  ¡Despliega!
