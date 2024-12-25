




















const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "stickersearch", // Commande principale
    alias: ["stsearch", "stickerssearch"], // Alias de la commande
    desc: "Search and convert GIFs to stickers from Tenor.", // Description de la commande
    category: "fun", // Catégorie
    react: "🔍", // Emoji de réaction
    filename: __filename, // Nom du fichier
}, async (conn, mek, m, { text, reply }) => {
    const tenorApiKey = "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c"; // Clé API Tenor

    try {
        // Vérifiez si une requête de recherche est fournie
        if (!text) {
            return reply(
                `Please provide a search term.\n\n*Example:*\n.stickersearch cat`
            );
        }

        // URL de l'API Tenor
        const apiUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(
            text.trim()
        )}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`;

        // Requête à l'API
        const response = await axios.get(apiUrl);

        // Vérifiez si des résultats sont retournés
        const results = response.data.results || [];
        if (results.length === 0) {
            return reply("No stickers found for your query.");
        }

        // Sélectionnez un GIF au hasard parmi les résultats
        const randomGif = results[Math.floor(Math.random() * results.length)];

        // Téléchargez et convertissez le GIF en sticker
        await conn.sendMessage(
            m.chat,
            { sticker: { url: randomGif.media_formats.gif.url } },
            { quoted: m }
        );
    } catch (error) {
        console.error("Stickersearch Command Error:", error.message);
        reply(
            "An error occurred while searching for stickers. Please try again later."
        );
    }
});