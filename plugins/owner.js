/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/



const { cmd } = require('../command');

cmd({
    pattern: "owner",
    react: "👑", // Reaction emoji when the command is triggered
    alias: ["silent", "kerm"],
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        // Owner's contact info
        const ownerNumber = '+237656520674'; // Replace this with the actual owner number
        const ownerName = '➺✭𝙺𝙴𝚁𝙼✭'; // Replace this with the owner's name
        const organization = 'UD TEAM'; // Optional: replace with the owner's organization

        // Create a vCard (contact card) for the owner
        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  // Full Name
                      `ORG:${organization};\n` +  // Organization (Optional)
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` +  // WhatsApp ID and number
                      'END:VCARD';

        // Send the vCard first
        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send a reply message that references the vCard
        await conn.sendMessage(from, {
            text: `This is the owner's contact: ${ownerName}`,
            contextInfo: {
                mentionedJid: [ownerNumber.replace('+237656520674') + '+923096287432@s.whatsapp.net'], // Mention the owner
                quotedMessageId: sentVCard.key.id // Reference the vCard message
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: 'Sorry, there was an error fetching the owner contact.' }, { quoted: mek });
    }
});

// Variable to track the bot's mode (private or public)
let botMode = {};

cmd({
    pattern: "mode",
    desc: "Toggle bot's response mode: private or public.",
    react: "🔒",
    category: "utility",
    use: ".mode private",
    filename: __filename
}, async (conn, mek, m, { reply, command, from }) => {
    try {
        // Extract the user's input from the command (either 'private' or 'public')
        const args = command.split(" ")[1];
        if (!args || (args !== "private" && args !== "public")) {
            return reply("❌ Please specify either 'private' or 'public'.\nExample: .mode private");
        }

        // Toggle the mode based on the user's input
        if (args === "private") {
            botMode[from] = "private";  // Set the bot to private mode for the user
            reply("✅ Bot is now in private mode. The bot will only respond to direct messages.");
        } else if (args === "public") {
            botMode[from] = "public";  // Set the bot to public mode for the user
            reply("✅ Bot is now in public mode. The bot will respond to messages in groups and private.");
        }
    } catch (error) {
        console.error("Error in mode command:", error);
        reply("❌ An error occurred while changing the bot's mode. Please try again.");
    }
});

// Middleware to check if the bot should respond in a group or in private
conn.on('chat-update', async (chatUpdate) => {
    try {
        if (!chatUpdate || !chatUpdate.messages || !chatUpdate.messages.all) return;

        const message = chatUpdate.messages.all[0];
        const from = message.key.remoteJid;

        // Check if the message is from a group
        const isGroupMessage = from.endsWith('@g.us');

        // Check if the user is in private mode
        if (botMode[from] === "private" && isGroupMessage) {
            return;  // Do not respond to group messages if the bot is in private mode
        }

        // If the bot is in public mode, it will respond to both private and group messages
        // Add your bot's message handling logic here (e.g., command processing, etc.)

    } catch (error) {
        console.error("Error in chat-update listener:", error);
    }
});