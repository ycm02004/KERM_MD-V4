


















const axios = require("axios"); // Importation d'axios pour les requêtes HTTP
const { cmd } = require("../command"); // Importation du gestionnaire de commandes

cmd({
    pattern: "ss", // Commande pour capturer l'écran
    alias: ["screenshot", "webcapture"], // Alias de la commande
    desc: "Capture the screenshot of a given URL.", // Description
    category: "tools", // Catégorie de la commande
    react: "📸", // Emoji de réaction
    filename: __filename, // Nom du fichier
}, async (conn, mek, m, { text, reply }) => {
    try {
        // Vérifiez si un lien a été fourni
        if (!text) {
            return reply("Please provide a URL to capture.\nExample: .ss https://example.com");
        }

        // Construire l'URL de l'API thum.io
        const apiUrl = `https://image.thum.io/get/fullpage/${encodeURIComponent(text.trim())}`;

        // Envoyer une requête GET pour récupérer l'image
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        // Vérifier si la réponse est correcte
        if (!response || !response.data) {
            return reply("Error capturing the URL. Please try again.");
        }

        // Envoyer l'image capturée comme réponse
        await conn.sendMessage(m.chat, {
            image: Buffer.from(response.data),
            caption: `📸 Screenshot of the URL:\n${text}`,
        }, { quoted: mek });
    } catch (error) {
        console.error("Screenshot Error:", error.message);
        reply("An error occurred while capturing the URL.");
    }
});