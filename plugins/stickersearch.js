
























const axios = require('axios');
const { cmd } = require("../command");

// Command: stickersearch
cmd({
    pattern: "stickersearch",
    alias: ["gifsearch"],
    react: "⏳",
    desc: "Search and send stickers (GIFs) from Tenor API.",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { reply, text, from }) => {
    if (!text) return reply('Please provide a search term for the sticker search.\nExample: .stickersearch funny cat');

    try {
        const tenorApiKey = 'AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c'; // Replace with your actual Tenor API key
        const apiUrl = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(text)}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`;

        // Fetch stickers from Tenor API
        const response = await axios.get(apiUrl);
        const results = response.data.results;

        if (!results.length) {
            return reply('No stickers found for your search query.');
        }

        // Select the first sticker from the results
        const sticker = results[0];
        const stickerUrl = sticker.media[0].gif.url;

        // Fetch the sticker to check the size before sending
        const stickerResponse = await axios.get(stickerUrl, { responseType: 'arraybuffer' });

        // Check if the sticker size is less than 2MB (2 * 1024 * 1024 bytes)
        if (stickerResponse.data.length > 2 * 1024 * 1024) {
            return reply('The sticker is too large to send. Please try a different search.');
        }

        // Send the sticker with the caption
        await conn.sendMessage(from, { 
            sticker: { url: stickerUrl }, 
            caption: `Here is your sticker for: *${text}* 🖼️`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply('An error occurred while fetching the sticker. Please try again later.');
    }
});