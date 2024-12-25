

























const axios = require('axios');
const { cmd } = require("../command");  // Ajout du require pour "command"

// Command: stickersearch
cmd({
    pattern: "stickersearch",
    alias: ["searchsticker", "stickersearcher"],
    react: "🔍",
    desc: "Search for stickers based on a keyword.",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { text, reply }) => {
    try {
        // Vérifier si un terme de recherche est fourni
        if (!text) {
            return reply("Please provide a search term for the sticker search.\nExample: .stickersearch funny cat");
        }

        // Construire l'URL de l'API Tenor pour rechercher des stickers
        const apiUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(text)}&key=AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c&client_key=my_project&limit=8&media_filter=gif`;
        
        // Requête API pour obtenir des stickers
        const response = await axios.get(apiUrl);
        const stickers = response.data.results;

        // Vérifier si des résultats sont trouvés
        if (!stickers || stickers.length === 0) {
            return reply("No stickers found for this search.");
        }

        // Sélectionner le premier sticker
        const stickerUrl = stickers[0].media[0].gif.url;

        // Envoyer le sticker trouvé
        await conn.sendMessage(m.chat, { sticker: { url: stickerUrl } }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("An error occurred while searching for stickers. Please try again later.");
    }
});