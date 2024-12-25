






















const axios = require("axios"); // Importer axios pour les requêtes HTTP
const { cmd } = require("../command"); // Gestionnaire de commandes

cmd({
    pattern: "bible", // Commande principale
    alias: ["verse", "scripture"], // Alias de la commande
    desc: "Get a Bible verse or passage using a reference.", // Description de la commande
    category: "religion", // Catégorie
    react: "📖", // Emoji de réaction
    filename: __filename, // Nom du fichier
}, async (conn, mek, m, { text, reply }) => {
    try {
        // Vérifiez si une référence biblique est fournie
        if (!text) {
            return reply(
                `Please provide a Bible reference.\n\n*Example:*\n.bible John 3:16`
            );
        }

        // URL de l'API avec la référence
        const apiUrl = `https://bible-api.com/${encodeURIComponent(text.trim())}`;

        // Requête à l'API
        const response = await axios.get(apiUrl);

        // Vérifiez si la réponse contient les données nécessaires
        if (!response.data || !response.data.text) {
            return reply(
                `Could not fetch the Bible verse. Please check the reference or try again later.`
            );
        }

        // Extraire les informations
        const { reference, text: verse, translation_name } = response.data;

        // Préparer le message à envoyer
        const message = `
*📖 Bible Verse:*

> *📜 Reference:* ${reference}
> *📝 Verse:* ${verse}
> *📘 Translation:* ${translation_name || "Unknown"}

> *🙏 BY KERM MD V4❤️*
        `;

        // Envoyer la réponse au chat
        reply(message);
    } catch (error) {
        console.error("Bible Command Error:", error.message);
        reply("An error occurred while fetching the Bible verse. Please try again later.");
    }
});