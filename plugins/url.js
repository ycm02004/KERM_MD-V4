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
        // Log message content to understand the structure
        console.log('Message content:', m);
        console.log('Quoted message:', m.quoted ? 'Yes' : 'No');
        let targetMessage = m.quoted ? m.quoted : m;

        // Ensure there's a mime type and it's an image
        let mimeType = targetMessage.mimetype || '';
        if (!mimeType.startsWith('image/')) {
            return reply("Please reply to an image.");
        }

        // Download the image data
        let imageData = await targetMessage.download();
        let tempPath = path.join(os.tmpdir(), 'TempImage');
        fs.writeFileSync(tempPath, imageData);

        // Prepare FormData for image upload
        let formData = new FormData();
        formData.append("image", fs.createReadStream(tempPath));

        // Log the image data size before uploading
        console.log("Image size:", imageData.length, "bytes");

        // Upload the image to the imgbb API
        let response = await axios.post(
            'https://api.imgbb.com/1/upload?key=06d00f0e4520243a32b58138765a2ecc',
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        // Check for successful upload and retrieve the image URL
        if (response.data && response.data.data && response.data.data.url) {
            let imageUrl = response.data.data.url;

            // Delete the temporary file after upload
            fs.unlinkSync(tempPath);

            // Prepare the caption with the image URL and size
            const caption = `*SILENT-SOBX-MD IMG URL📸*\n\n` +
                            `> *Size:* ${imageData.length} Byte(s)\n` +
                            `> *URL:* ${imageUrl}\n\n` +
                            `> *⚖️ UPLOAD - : © BY SILENTLOVER432*`;

            // Send the result
            m.reply(caption);
        } else {
            throw new Error("Error while uploading the image.");
        }

    } catch (error) {
        console.error("Error occurred:", error);
        reply(`Error: ${error.message}`);
    }
});