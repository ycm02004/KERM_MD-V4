












const { cmd } = require('../command');
let antideleteStatus = {}; // Tracks the ON/OFF status for each chat

cmd({
    pattern: "antidelete",
    desc: "Enable or disable the Antidelete feature (ON/OFF).",
    react: "🛡️",
    category: "utility",
    use: ".antidelete [on/off]",
    filename: __filename,
}, async (conn, mek, m, { args, reply, from, isGroup }) => {
    if (!isGroup) {
        return reply("❌ This command can only be used in groups.");
    }

    if (args.length === 0) {
        return reply("❌ Please specify `on` or `off`.\nExample: `.antidelete on`");
    }

    const option = args[0].toLowerCase();
    if (option === "on") {
        antideleteStatus[from] = true;
        reply("✅ Antidelete has been enabled. Deleted messages will now be logged.");
    } else if (option === "off") {
        antideleteStatus[from] = false;
        reply("❌ Antidelete has been disabled. Deleted messages will no longer be logged.");
    } else {
        return reply("❌ Invalid option. Use `on` or `off`.");
    }
});

// Listen for message deletions
conn.ev.on("messages.update", async (updates) => {
    for (const { key, updateType, message } of updates) {
        const chatId = key.remoteJid;

        // If antidelete is enabled for the chat
        if (antideleteStatus[chatId] && updateType === "messageDeleted") {
            const sender = key.participant || key.remoteJid;
            const msgContent = message?.message?.conversation || "❌ Unable to fetch deleted content.";

            // Forward the deleted message back to the chat
            await conn.sendMessage(chatId, {
                text: `🚨 *Deleted Message Alert!*\nMessage from @${sender.split('@')[0]} was deleted:\n\n${msgContent}`,
                mentions: [sender],
            });
        }
    }
});
// Command for sending the WhatsApp channel link
cmd({
    pattern: "channel",
    desc: "Get the link to the official WhatsApp channel.",
    react: "📢",
    category: "utility",
    use: ".channel",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        // Define the channel link inside the command
        const channelLink = "https://chat.whatsapp.com/example_channel_link";

        // Send the channel link to the user
        reply(`📢 Here's the link to our official WhatsApp Kerm channel:\n\n${channelLink}\n\nJoin us to stay updated with the latest news and announcements.`);
    } catch (error) {
        // Log and notify about any errors
        console.error("Error sending channel link:", error.message);
        reply("❌ Sorry, an error occurred while trying to send the channel link.");
    }
});
// Command for sending the support group or page link
cmd({
    pattern: "support",
    desc: "Get the link to the support group or page.",
    react: "🛠️",
    category: "utility",
    use: ".support",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        // Define the support link inside the command
        const supportLink = "https://chat.whatsapp.com/example_support_link";

        // Send the support link to the user
        reply(`🛠️ Need help or have questions ? Join kerm support group:\n\n${supportLink}\n\nFeel free to ask your questions or report issues.`);
    } catch (error) {
        // Log and notify about any errors
        console.error("Error sending support link:", error.message);
        reply("❌ Sorry, an error occurred while trying to send the support link.");
    }
});