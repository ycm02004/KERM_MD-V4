






const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fuck", // Nom de la commande
    desc: "Fetch a NSFW image related to the command",
    category: "fun",
    use: '.fuck',
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiURL = `https://qr-pair-anyav2.koyeb.app/showcase/nsfw-images?category=fuck`;
        
        // Récupérer l'image via l'API
        const response = await axios.get(apiURL);

        if (response.data && response.data.image_url) {
            const imageUrl = response.data.image_url;

            // Envoi de l'image avec le caption
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `Here your ${command} image 🔞🍆🍑.\n> KERM🍑🔞.`,
            }, { quoted: mek });
        } else {
            await reply('❌ No image found for this category.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while fetching the image.');
    }
});
cmd({
    pattern: "pussy", // Nom de la commande
    desc: "Fetch a NSFW image related to the command",
    category: "fun",
    use: '.pussy',
    react: "🍑",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiURL = `https://qr-pair-anyav2.koyeb.app/showcase/nsfw-images?category=pussy`;
        
        // Récupérer l'image via l'API
        const response = await axios.get(apiURL);

        if (response.data && response.data.image_url) {
            const imageUrl = response.data.image_url;

            // Envoi de l'image avec le caption
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `Here your ${command} image 🔞🍆🍑.\n> KERM🍑🔞.`,
            }, { quoted: mek });
        } else {
            await reply('❌ No image found for this category.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while fetching the image.');
    }
});
cmd({
    pattern: "hentai", // Nom de la commande
    desc: "Fetch a NSFW image related to the command",
    category: "fun",
    use: '.hentai',
    react: "🍑",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiURL = `https://qr-pair-anyav2.koyeb.app/showcase/nsfw-images?category=hentai`;
        
        // Récupérer l'image via l'API
        const response = await axios.get(apiURL);

        if (response.data && response.data.image_url) {
            const imageUrl = response.data.image_url;

            // Envoi de l'image avec le caption
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `Here your ${command} image 🔞🍆🍑.\n> KERM🍑🔞.`,
            }, { quoted: mek });
        } else {
            await reply('❌ No image found for this category.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while fetching the image.');
    }
});