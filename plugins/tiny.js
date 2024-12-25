





















const axios = require("axios"); // Importer Axios pour les requêtes HTTP
const { cmd } = require("../command"); // Importer la gestion des commandes

// Commande Tiny
cmd({
    pattern: "tiny", // Mot-clé de la commande
    desc: "Shorten a URL using TinyURL.", // Description de la commande
    category: "tools", // Catégorie de la commande
    react: "🔗", // Emoji de réaction pour la commande
    filename: __filename // Nom du fichier pour référence
}, async (conn, mek, m, { text, reply }) => {
    try {
        // Vérifier si l'utilisateur a fourni une URL
        if (!text) {
            return reply(
                `Hello,\nKerm Tiny URL Shortener Here.\nPlease provide a URL to shorten.\n*Usage:*\n.tiny https://example.com`
            );
        }

        const urlToShorten = text.trim(); // Supprimer les espaces inutiles

        // Vérifier si l'URL fournie est valide
        if (!urlToShorten.startsWith("http://") && !urlToShorten.startsWith("https://")) {
            return reply("Please provide a valid URL starting with http:// or https://.");
        }

        // Construire l'URL de l'API TinyURL
        const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`;

        // Envoyer une requête pour raccourcir l'URL
        const response = await axios.get(apiUrl);

        // Renvoyer l'URL raccourcie
        reply(`🔗 Here is your shortened URL: ${response.data}`);
    } catch (error) {
        // Gérer les erreurs et notifier l'utilisateur
        console.error("Error shortening URL:", error.message);
        reply("Error shortening URL. Please check the URL format or try again later.");
    }
});