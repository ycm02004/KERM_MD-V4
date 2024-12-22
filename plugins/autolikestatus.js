const { cmd } = require('./command');
const config = require('./config');

// Command to set emoji for auto-like on statuses
cmd({
    pattern: "autolikeemoji",
    desc: "Automatically react to WhatsApp statuses with a chosen emoji.",
    react: "👍",
    category: "utility",
    use: ".autolikeemoji <emoji>",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("❌ Please specify the emoji to use for auto-like.");
        
        const emoji = args[0]; // Get the emoji from user input
        config.autolikeemoji.emoji = emoji; // Save emoji to the config
        reply(`✅ Auto-like emoji set to: ${emoji}`);
    } catch (error) {
        console.error("Error in autolikeemoji command:", error.message);
        reply("❌ An error occurred while processing the command.");
    }
});

// Automatically react to statuses
conn.ev.on("presence.update", async (update) => {
    try {
        const emoji = config.autolikeemoji?.emoji || "👍"; // Default emoji if none set

        // Check if the status was viewed and react with the emoji
        if (update.status === 'viewed') {
            await conn.sendMessage(update.id, {
                react: { text: emoji, key: update.key },
            });
            console.log(`Reacted to status with emoji: ${emoji}`);
        }
    } catch (error) {
        console.error("Error reacting to status update:", error.message);
    }
});