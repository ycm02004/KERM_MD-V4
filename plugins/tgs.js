































const { cmd } = require("../command");
const axios = require("axios");

const TELEGRAM_API_URL = "https://api.telegram.org/bot7994740472:AAG0B4AVVbYhFK36iIhkKinSdh5Dg5rz5s4/";

cmd({
    pattern: "tgs",
    desc: "Télécharger les stickers Telegram depuis un lien.",
    category: "media",
    react: "📦",
    filename: __filename
}, async (conn, mek, m, { reply, text }) => {
    try {
        // Validation du lien du pack de stickers
        const stickerLinkPattern = /^https:\/\/t\.me\/addstickers\/[a-zA-Z0-9-_]+$/;
        const stickerMatch = text.match(stickerLinkPattern);

        if (!stickerMatch) {
            return reply("❌ *Please provide a valid Telegram sticker link.*\n\n*Example:* .tgs https://t.me/addstickers/ExamplePack 5");
        }

        // Si le lien est valide, on vérifie le nombre de stickers (optionnel)
        const parts = text.split(' ');
        const numberOfStickers = parts.length > 1 ? parseInt(parts[1], 10) : 10; // Par défaut 10 stickers

        // Vérifier que le nombre est valide (entre 1 et 100)
        if (isNaN(numberOfStickers) || numberOfStickers < 1 || numberOfStickers > 100) {
            return reply("❌ *Please provide a valid number of stickers between 1 and 100.*");
        }

        // Obtenir l'ID du pack de stickers à partir du lien
        const packId = stickerMatch[0].split('/').pop(); // Le pack ID est la dernière partie du lien

        // Utiliser l'API pour récupérer les stickers (remplacez ce code par une fonction qui obtient les stickers réels)
        // Ici, on va simuler l'obtention des stickers. Remplacez par une logique réelle pour obtenir les stickers du pack.

        const stickers = [];
        for (let i = 0; i < numberOfStickers; i++) {
            // Remplacer l'URL par un lien réel à récupérer via l'API Telegram ou par scrapping
            stickers.push(`https://t.me/addstickers/${packId}/sticker${i + 1}.png`);
        }

        if (stickers.length === 0) {
            return reply("❌ *No stickers found in the pack.* Please try again later.");
        }

        // Envoyer les stickers un par un ou en lots selon votre logique
        for (let i = 0; i < stickers.length; i++) {
            await axios.post(`${TELEGRAM_API_URL}sendSticker`, {
                chat_id: m.chat, // ID du chat
                sticker: stickers[i] // URL du sticker
            });
        }

        // Message de succès
        reply(`🎉 *Successfully sent ${stickers.length} stickers from the pack!*`);
    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while fetching the stickers.* Please try again later.");
    }
});