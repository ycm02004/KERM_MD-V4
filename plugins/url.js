/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/







const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { cmd } = require('../command');

// Command: .maid
cmd({
    pattern: "maid",
    alias: ["imgtourl", "img2url", "tourl"],
    react: "🖇",
    desc: "Download anime maid images.",
    category: "anime",
    use: ".maid",
    filename: __filename,
}, async (conn, mek, m, options) => {
    const { reply, quoted } = options;

    try {
        // Vérification si le message est une image
        let targetMessage = m.quoted ? m.quoted : m;
        if (!targetMessage.mimetype || !targetMessage.mimetype.startsWith('image/')) {
            return reply("Please reply to an image.");
        }

        // Téléchargement de l'image
        let imageData = await targetMessage.download();
        let tempPath = path.join(os.tmpdir(), 'TempImage');
        fs.writeFileSync(tempPath, imageData);

        // Préparation du formulaire pour l'upload
        let formData = new FormData();
        formData.append("image", fs.createReadStream(tempPath));

        // Upload de l'image sur l'API imgbb
        let response = await axios.post(
            'https://api.imgbb.com/1/upload?key=06d00f0e4520243a32b58138765a2ecc',
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        if (response.data && response.data.data && response.data.data.url) {
            let imageUrl = response.data.data.url;

            // Supprimer le fichier temporaire après l'upload
            fs.unlinkSync(tempPath);

            // Réponse avec l'URL de l'image
            const caption = `*SILENT-SOBX-MD IMG URL📸*\n\n` +
                            `> *Size:* ${imageData.length} Byte(s)\n` +
                            `> *URL:* ${imageUrl}\n\n` +
                            `> *⚖️ UPLOAD - : © BY SILENTLOVER432*`;

            // Envoi du résultat
            m.reply(caption);
        } else {
            reply("An error occurred while uploading the image.");
        }
    } catch (error) {
        console.error(error);
        reply("An error occurred, please try again.");
    }
});