
























const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "tgs",
    desc: "Download Telegram stickers from a given link",
    category: "utility",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { reply, text }) => {
    try {
        // Vérifier si le texte contient un lien valide et un nombre optionnel
        const args = text.split(" ");
        const stickerLink = args[0];
        let numberOfStickers = args[1] ? parseInt(args[1], 10) : 1;  // Si le nombre n'est pas spécifié, on prend 1 sticker par défaut

        // Validation du lien Telegram pour les autocollants
        if (!stickerLink || !stickerLink.startsWith("https://t.me/addstickers/")) {
            return reply("❌ *Please provide a valid Telegram sticker link.*\nExample: .tgs https://t.me/addstickers/ExamplePack 5");
        }

        // Validation du nombre de stickers
        if (numberOfStickers < 1 || numberOfStickers > 100) {
            return reply("❌ *Please provide a number between 1 and 100 for the number of stickers.*");
        }

        // Extraire l'ID du pack de stickers
        const packId = stickerLink.split("/").pop();

        // Appeler l'API Telegram pour obtenir les stickers
        const url = `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${packId}`;
        const response = await axios.get(url);

        if (response.data.ok && response.data.result.stickers.length > 0) {
            const stickers = response.data.result.stickers.slice(0, numberOfStickers);

            for (let sticker of stickers) {
                await conn.sendMessage(m.chat, { sticker: { url: sticker.thumb_file_id } }, { quoted: mek });
            }

            reply(`✔️ Sent ${stickers.length} sticker(s) from the pack!`);
        } else {
            reply("❌ *No stickers found in this pack.*");
        }
    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the stickers.* Please try again later.");
    }
});