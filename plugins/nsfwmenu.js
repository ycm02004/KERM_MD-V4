














const { cmd } = require('../command'); // Assurez-vous que cmd est bien défini dans votre projet
const axios = require('axios');

cmd({
    pattern: "nsfw",
    desc: "Display a list of NSFW options",
    category: "fun",
    use: '.nsfw',
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const nsfwList = `
Here is your NSFW command, choose one:

🍆 **PUSSY** 
🍑 **FUCK**
🔞 **HENTAI**

Simply type the number corresponding to the option you'd like to choose.`;

        // Send the NSFW list with an image and caption
        await conn.sendMessage(from, { 
            text: nsfwList, 
            caption: 'Choose one from the list above!', 
            image: { url: 'https://i.ibb.co/zFghN2T/Manul-Ofc-X.jpg' }
        }, { quoted: mek });
    } catch (e) {
        console.error(e);
        reply('❌ An error occurred while processing your request.');
    }
});