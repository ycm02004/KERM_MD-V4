






























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
        // Requête à l'API Popcat pour récupérer une phrase de drague
        const response = await axios.get('https://api.popcat.xyz/pickuplines');

        // Vérifier si la réponse contient une phrase de drague
        if (response.data && response.data.pickle) {
            const pickupLine = response.data.pickle;

            // Formater la réponse avec des emojis
            const message = `💘 *Here's a random pickup line for you:* \n\n"${pickupLine}" 😏`;

            // Envoyer la réponse
            await reply(message);
        } else {
            return reply("❌ *Sorry, no pickup line found at the moment.* Please try again later.");
        }
    } catch (error) {
        console.error(error);
        reply("⚠️ *An error occurred while fetching a pickup line. Please try again later.*");
    }
});