












const { cmd } = require('../command');
let antideleteStatus = {}; // Stores the ON/OFF status for each chat

cmd({
    pattern: "antidelete",
    desc: "Toggle the Antidelete feature (ON/OFF)",
    react: "🛡️",
    category: "group",
    use: ".antidelete [on/off]",
    filename: __filename,
}, async (conn, mek, m, { args, reply, from }) => {
    // Toggle the Antidelete status
    if (args.length === 0) {
        return reply("❌ Please specify `on` or `off`.\nExample: `.antidelete on`");
    }

    const option = args[0].toLowerCase();
    if (option === "on") {
        antideleteStatus[from] = true;
        reply("✅ Antidelete has been turned ON. All deleted messages will be logged.");
    } else if (option === "off") {
        antideleteStatus[from] = false;
        reply("❌ Antidelete has been turned OFF. Deleted messages will no longer be logged.");
    } else {
        return reply("❌ Invalid option. Use `on` or `off`.");
    }
});

// Monitor messages and check for deleted messages
conn.ev.on("messages.update", async (update) => {
    for (const { key, message, updateType } of update) {
        const chatId = key.remoteJid;

        // Check if Antidelete is enabled for the chat
        if (antideleteStatus[chatId] && updateType === "messageDeleted" && message) {
            const sender = message?.key?.participant || key.participant;
            const content = message?.message?.conversation || "Media message";

            // Forward the deleted message back to the chat
            conn.sendMessage(chatId, {
                text: `🚨 *Antidelete Alert!* \nMessage from @${sender.split('@')[0]} was deleted:\n\n${content}`,
                mentions: [sender],
            });
        }
    }
});