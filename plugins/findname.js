





























const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "fname",
    alias: ["findname"],
    desc: "Find the nationality of a given name.",
    category: "fun",
    react: "🌍",
    filename: __filename
}, async (conn, mek, m, { reply, text }) => {
    try {
        // Vérifier si un prénom a été fourni
        if (!text) {
            return reply("❌ *Please provide a name to find the nationality.*\n*Example:* .fname Rayan");
        }

        // Requête à l'API Nationalize
        const response = await axios.get(`https://api.nationalize.io/?name=${text}`);

        // Vérifier si la réponse contient des résultats
        if (response.data.country && response.data.country.length > 0) {
            let message = `🌍 *Nationality Prediction for* _${text}_\n\n`;

            // Format de la réponse pour chaque pays et probabilité
            response.data.country.forEach(country => {
                message += `🌏 *Country:* ${country.country_id}\n📊 *Probability:* ${(country.probability * 100).toFixed(2)}%\n\n`;
            });

            // Envoyer la réponse
            await reply(message);
        } else {
            return reply(`❌ *No nationalities found for the name* _${text}_.\nPlease try another name.`);
        }
    } catch (error) {
        console.error(error);
        reply("⚠️ *An error occurred while fetching nationality data. Please try again.*");
    }
});