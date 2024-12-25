




























const axios = require("axios"); // Importer axios pour les requêtes HTTP
const { cmd } = require("../command"); // Gestionnaire de commandes

cmd({
    pattern: "google", // Commande principale
    alias: ["search", "websearch"], // Alias de la commande
    desc: "Search the web using Google.", // Description de la commande
    category: "tools", // Catégorie
    react: "🌐", // Emoji de réaction
    filename: __filename, // Nom du fichier
}, async (conn, mek, m, { text, reply }) => {
    try {
        // Vérifiez si une requête de recherche est fournie
        if (!text) {
            return reply(
                `Please provide a search query.\n\n*Example:*\n.google OpenAI`
            );
        }

        // URL de l'API avec la requête utilisateur
        const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
            text.trim()
        )}&key=AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5`;

        // Requête à l'API
        const response = await axios.get(apiUrl);

        // Vérifiez si des résultats sont retournés
        const items = response.data.items || [];
        if (items.length === 0) {
            return reply("No results found for your query.");
        }

        // Construire la réponse avec les résultats
        let message = `*🌐 Google Search Results:*\n\n`;

        items.slice(0, 5).forEach((item, index) => {
            message += `*${index + 1}. ${item.title}*\n`;
            message += `${item.snippet}\n`;
            message += `🔗 ${item.link}\n\n`;
        });

        // Envoyer la réponse
        reply(message.trim());
    } catch (error) {
        console.error("Google Command Error:", error.message);
        reply(
            "An error occurred while searching the web. Please try again later."
        );
    }
});