/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/





const { cmd } = require('../command');
const axios = require('axios');
const { Buffer } = require('buffer');

const GOOGLE_API_KEY = 'AIzaSyDebFT-uY_f82_An6bnE9WvVcgVbzwDKgU'; // Replace with your Google API key
const GOOGLE_CX = '45b94c5cef39940d1'; // Replace with your Google Custom Search Engine ID

cmd({
    pattern: "img",
    desc: "Search and send images from Google.",
    react: "🖼️",
    category: "media",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q) return reply("Please provide a search query for the image.");

        // Fetch image URLs from Google Custom Search API
        const searchQuery = encodeURIComponent(q);
        const url = `https://www.googleapis.com/customsearch/v1?q=${searchQuery}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=5`;
        
        const response = await axios.get(url);
        const data = response.data;

        if (!data.items || data.items.length === 0) {
            return reply("No images found for your query.");
        }

        // Send images
        for (let i = 0; i < data.items.length; i++) {
            const imageUrl = data.items[i].link;

            // Download the image
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(imageResponse.data, 'binary');

            // Send the image with a footer
            await conn.sendMessage(from, {
                image: buffer,
                caption: `
*💗Image ${i + 1} from your search!💗*

 *Enjoy these images! 👾*

> 🌈*KERM_MD-V4 BOT PLUGINS*🏝️`
}, { quoted: mek });
}

    } catch (e) {
        console.error(e);
        reply(`Error: ${e.message}`);
    }
});
cmd({
    pattern: "ss",
    desc: "Take a screenshot of a webpage for a selected device.",
    react: "📸",
    category: "media",
    use: ".ss <link>",
    filename: __filename,
}, async (conn, mek, m, { args, reply, isGroup }) => {
    try {
        // Validate the URL
        const url = args[0];
        if (!url || !url.startsWith('http')) {
            return reply(`❌ Please provide a valid URL.\nExample: .ss https://example.com`);
        }

        // Notify user that screenshot capture has started
        reply(`📸 Capturing the screenshot... Please wait.`);

        // Ask user for the device type
        const replyMessage = await conn.sendMessage(m.chat, {
            text: `Please choose the device for the screenshot:\n\n1. Android\n2. Tablet\n3. PC`,
            contextInfo: { mentionedJid: [m.sender] },
        });

        // Wait for the user's response
        const filter = (message) => message.key.fromMe === false && message.key.remoteJid === m.chat && message.text;
        const collected = await conn.waitForMessage(m.chat, filter, { timeout: 60000 }); // Timeout after 60 seconds

        if (!collected) {
            return reply('❌ No response received in time.');
        }

        // Get the user's choice
        const choice = collected.text.trim();

        // Set viewport based on the device choice
        let viewport = { width: 1280, height: 720 }; // Default to PC (if something else is entered)
        switch (choice) {
            case '1':
                viewport = { width: 360, height: 640 }; // Android
                break;
            case '2':
                viewport = { width: 768, height: 1280 }; // Tablet
                break;
            case '3':
                viewport = { width: 1280, height: 720 }; // PC
                break;
            default:
                return reply('❌ Invalid choice. Please choose 1 for Android, 2 for Tablet, or 3 for PC.');
        }

        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport(viewport);

        // Navigate to the URL
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        // Take a screenshot
        const screenshotBuffer = await page.screenshot({ fullPage: true });

        // Close the browser
        await browser.close();

        // Send the screenshot to the chat
        await conn.sendMessage(m.chat, { image: screenshotBuffer, caption: `📸 Screenshot of: ${url} on ${choice === '1' ? 'Android' : choice === '2' ? 'Tablet' : 'PC'}` });
        
    } catch (e) {
        console.error('Error capturing screenshot:', e);
        reply(`❌ Failed to capture screenshot. Please try again.`);
    }
});
