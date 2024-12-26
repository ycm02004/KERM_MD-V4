



































const axios = require("axios");
const fs = require("fs");
const { cmd } = require("../command");

// Commande: tgs
cmd(
  {
    pattern: "tgs",
    desc: "Download and send stickers from a Telegram sticker pack.",
    category: "tools",
    react: "✨",
    filename: __filename,
  },
  async (conn, mek, m, { reply, text }) => {
    try {
      // Vérifier si l'utilisateur a fourni un lien de sticker pack
      if (!text || !text.startsWith("https://t.me/addstickers/")) {
        return reply(
          `❌ *Please provide a valid Telegram sticker link and optionally the number of stickers.*\n\n*Example:* .tgs https://t.me/addstickers/ExamplePack 5`
        );
      }

      const args = text.trim().split(" ");
      const stickerPackName = args[0].split("/").pop(); // Nom du sticker pack
      const numStickers = parseInt(args[1]) || 1; // Nombre de stickers (1 par défaut)

      if (numStickers < 1 || numStickers > 100) {
        return reply(`❌ *Please specify a number of stickers between 1 and 100.*`);
      }

      // Appeler l'API Telegram Bot pour obtenir les stickers
      const apiUrl = `https://api.telegram.org/bot7994740472:AAG0B4AVVbYhFK36iIhkKinSdh5Dg5rz5s4/getStickerSet?name=${stickerPackName}`;
      const response = await axios.get(apiUrl);

      if (!response.data.ok || !response.data.result || !response.data.result.stickers) {
        return reply(`❌ *Failed to fetch stickers from this pack. Please check the link.*`);
      }

      const stickers = response.data.result.stickers.slice(0, numStickers);

      if (stickers.length === 0) {
        return reply(`❌ *No stickers found in this pack.*`);
      }

      // Télécharger et envoyer chaque sticker
      for (const sticker of stickers) {
        const fileId = sticker.file_id;

        // Obtenir le fichier sticker
        const fileResponse = await axios.get(
          `https://api.telegram.org/bot7994740472:AAG0B4AVVbYhFK36iIhkKinSdh5Dg5rz5s4/getFile?file_id=${fileId}`
        );

        const filePath = fileResponse.data.result.file_path;
        const fileUrl = `https://api.telegram.org/file/bot7994740472:AAG0B4AVVbYhFK36iIhkKinSdh5Dg5rz5s4/${filePath}`;

        // Télécharger le fichier sticker
        const fileName = `./${sticker.file_unique_id}.webp`;
        const fileStream = fs.createWriteStream(fileName);

        const downloadResponse = await axios({
          url: fileUrl,
          method: "GET",
          responseType: "stream",
        });
        downloadResponse.data.pipe(fileStream);

        // Attendre que le fichier soit téléchargé
        await new Promise((resolve, reject) => {
          fileStream.on("finish", resolve);
          fileStream.on("error", reject);
        });

        // Envoyer le fichier en tant que sticker
        await conn.sendMessage(
          m.chat,
          { sticker: fs.readFileSync(fileName) },
          { quoted: mek }
        );

        // Supprimer le fichier local après envoi
        fs.unlinkSync(fileName);
      }

      reply(`✅ *Successfully sent ${stickers.length} sticker(s) from the pack by Kerm🏮.*`);
    } catch (error) {
      console.error(error);
      reply(`❌ *An error occurred while fetching or sending stickers. Please try again later.*`);
    }
  }
);