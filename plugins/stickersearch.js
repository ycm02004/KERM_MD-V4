

























const axios = require('axios');
const { cmd } = require("../command");  // Assurez-vous d'importer correctement "command"
const fs = require('fs');

// Commande: stickersearch
cmd({
    pattern: "stickersearch",
    alias: ["searchsticker", "stickersearcher"],
    react: "🔍",
    desc: "Search for stickers based on a keyword.",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { text, reply }) => {
    try {
        // Vérifier si un mot-clé est fourni après la commande
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

        // Télécharger le sticker pour vérifier la taille
        const stickerResponse = await axios.get(stickerUrl, { responseType: 'arraybuffer' });

        // Vérifier la taille du sticker (en Ko)
        const stickerSize = Buffer.byteLength(stickerResponse.data) / 1024; // Taille en Ko
        if (stickerSize > 1024) {  // Limite de 1 Mo (1024 Ko)
            return reply("The sticker is too large to send. Please try a different search.");
        }

        // Sauvegarder le sticker temporairement avant l'envoi
        const tempPath = './tempSticker.gif';
        fs.writeFileSync(tempPath, stickerResponse.data);

        // Envoyer le sticker si la taille est correcte
        await conn.sendMessage(m.chat, { sticker: { url: tempPath } }, { quoted: mek });

        // Supprimer le fichier temporaire après l'envoi
        fs.unlinkSync(tempPath);

    } catch (error) {
        console.error(error);
        reply("An error occurred while searching for stickers. Please try again later.");
    }
});