






















const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "tiny",
    alias: ["shorten", "shorturl"],
    desc: "Shorten a URL using TinyURL.",
    category: "tools",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Vérifiez si l'utilisateur a fourni une URL
        if (args.length === 0) {
            return reply(`❌ *Please provide a URL to shorten.*\n\n*Example:*\n.tiny https://example.com`);
        }

        const urlToShorten = args[0].trim(); // URL à raccourcir

        // Vérifiez si l'URL est valide
        if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(urlToShorten)) {
            return reply(`❌ *Invalid URL format. Please provide a valid URL.*`);
        }

        // URL de l'API TinyURL
        const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`;

        // Appel à l'API TinyURL
        const response = await axios.get(apiUrl);

        // Vérifiez si l'API a renvoyé un résultat valide
        if (!response.data || response.data.includes("Error")) {
            throw new Error("API response invalid or failed.");
        }

        // Envoyer l'URL raccourcie
        reply(`✅ *URL Shortened Successfully!*\n\n🔗 *Short URL:* ${response.data}`);
    } catch (error) {
        console.error("Error in Tiny Command:", error.message);
        reply(`❌ *An error occurred while shortening the URL. Please try again later.*`);
    }
});