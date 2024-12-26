const axios = require('axios');
const { cmd } = require("../command");

cmd({
    pattern: "tgs",
    desc: "Download Telegram stickers from a pack.",
    category: "media",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { reply, text }) => {
    if (!text) {
        return reply("❌ *Please provide a valid Telegram sticker link and optionally the number of stickers.*\nExample: .tgs https://t.me/addstickers/ExamplePack 5");
    }

    let [url, count] = text.split(" ");
    count = count ? parseInt(count) : 1; // Default to 1 sticker if not provided.

    // Limit the number of stickers to a max of 100
    if (count > 100) {
        count = 100;
    }

    if (!url.startsWith("https://t.me/addstickers/")) {
        return reply("❌ *Invalid link provided.* Please use a valid Telegram sticker link.");
    }

    try {
        const apiUrl = `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${url.split("/")[4]}`; // Correct API endpoint to fetch stickers.
        const response = await axios.get(apiUrl);
        const stickers = response.data.result.stickers;

        if (!stickers || stickers.length === 0) {
            return reply("❌ *No stickers found in this pack.*");
        }

        let stickerCount = Math.min(count, stickers.length); // Ensure count does not exceed the available stickers in the pack.
        for (let i = 0; i < stickerCount; i++) {
            await conn.sendMessage(m.chat, { sticker: { url: stickers[i].file_url } }, { quoted: mek });
        }

    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the stickers.* Please try again later.");
    }
});