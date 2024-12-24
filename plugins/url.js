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
    const { reply } = options;

    try {
        // Check if the current message or the quoted message contains an image
        let targetMessage = m.quoted ? m.quoted : m;
        let mimeType = targetMessage.mimetype || '';
        console.log("MIME Type: ", mimeType);  // Log the MIME type for debugging
        if (!mimeType || !mimeType.startsWith('image/')) throw "Please reply to an image.";

        // Download the image
        let imageData = await targetMessage.download();
        let tempPath = path.join(os.tmpdir(), 'TempImage');
        fs.writeFileSync(tempPath, imageData);

        // Prepare the data for upload
        let formData = new FormData();
        formData.append("image", fs.createReadStream(tempPath));

        // Upload the image to the imgbb API
        let response = await axios.post(
            'https://api.imgbb.com/1/upload?key=06d00f0e4520243a32b58138765a2ecc',
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        if (!response.data || !response.data.data || !response.data.data.url) {
            throw "Error while uploading the image.";
        }

        // Get the URL of the uploaded image
        let imageUrl = response.data.data.url;

        // Delete the temporary file
        fs.unlinkSync(tempPath);

        // Prepare the caption with size and URL
        const caption = `*SILENT-SOBX-MD IMG URL📸*\n\n` +
                        `> *Size:* ${imageData.length} Byte(s)\n` +
                        `> *URL:* ${imageUrl}\n\n` +
                        `> *⚖️ UPLOAD - : © BY SILENTLOVER432*`;

        // Send the result
        m.reply(caption);

    } catch (error) {
        reply(`${error}`);
        console.error(error);
    }
});