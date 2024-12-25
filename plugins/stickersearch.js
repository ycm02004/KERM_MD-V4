

























const axios = require('axios');
const { cmd } = require("../command");

cmd({
    pattern: "stickersearch",
    alias: ["searchsticker"],
    desc: "Search for stickers.",
    category: "fun",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { reply, text }) => {
    try {
        // Vérification que l'utilisateur a bien fourni un terme de recherche
        if (!text) {
            return reply("Please provide a search term for the sticker search.\nExample: .stickersearch funny cat");
        }

        // Utilisation de l'API Tenor pour rechercher un sticker
        const apiUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(text)}&key=AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c&client_key=my_project&limit=8&media_filter=gif`;
        
        // Envoi de la requête à l'API Tenor
        const response = await axios.get(apiUrl);
        
        // Vérification qu'il y a des résultats
        if (!response.data.results || response.data.results.length === 0) {
            return reply("No stickers found for your search query.");
        }

        // Trouver un sticker qui respecte la taille maximale (par exemple, 1 Mo)
        const maxSize = 1 * 1024 * 1024; // 1 Mo en octets
        let validStickerUrl = null;

        for (let result of response.data.results) {
            const stickerUrl = result.media[0].gif.url;

            // Téléchargez le sticker pour obtenir sa taille
            const stickerResponse = await axios.get(stickerUrl, { responseType: 'arraybuffer' });
            const stickerSize = stickerResponse.data.length;

            // Si la taille du sticker est inférieure ou égale à la taille maximale, on le garde
            if (stickerSize <= maxSize) {
                validStickerUrl = stickerUrl;
                break;
            }
        }

        // Si un sticker valide est trouvé, l'envoyer
        if (validStickerUrl) {
            await conn.sendMessage(m.chat, {
                sticker: { url: validStickerUrl },
            }, { quoted: mek });
        } else {
            reply("No stickers found that fit within the size limit.");
        }

    } catch (error) {
        console.error(error);
        reply("An error occurred while searching for the sticker. Please try again later.");
    }
});