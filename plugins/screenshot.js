
























const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "ss",
    alias: ["screenshot", "webcapture"],
    desc: "Take a screenshot of a website.",
    category: "tools",
    react: "📸",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Vérifiez si un lien est fourni
        if (args.length === 0) {
            return reply(`❗ *Please provide a URL to capture.*\n\n*Example:*\n.ss https://example.com`);
        }

        const url = args[0]; // URL fournie par l'utilisateur

        // Vérifiez si l'URL est valide
        if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(url)) {
            return reply(`❌ *Invalid URL format. Please provide a valid URL.*`);
        }

        // URL de l'API de capture d'écran
        const apiUrl = `https://shot.screenshotapi.net/screenshot?token=YOUR_API_KEY&url=${encodeURIComponent(url)}&width=1280&height=720&full_page=true&output=image`;

        // Requête à l'API
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data, "binary");

        // Envoi de la capture d'écran à l'utilisateur
        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `📸 *Screenshot Captured Successfully!*\n\n🔗 *URL:* ${url}`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply(`⚠️ *An error occurred while capturing the screenshot.*\n\n${error.message}`);
    }
});