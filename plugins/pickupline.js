






























const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "pickup",
    desc: "Get a random pickup line.",
    category: "fun",
    react: "💘",
    filename: __filename
}, async (conn, mek, m, { reply }) => {
    try {
        // Utiliser l'API pour obtenir une ligne de séduction aléatoire
        const apiUrl = "https://api.popcat.xyz/pickuplines";
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Vérifier si une ligne de séduction a été trouvée
        if (!data || !data.pickup_line) {
            return reply("❌ *Sorry, no pickup line found at the moment.* Please try again later.");
        }

        // Envoyer la ligne de séduction
        reply(`💘 *Here is your pickup line:*\n\n"${data.pickup_line}"`);
    } catch (error) {
        console.error(error);
        reply("⚠️ *An error occurred while fetching a pickup line. Please try again later.*");
    }
});