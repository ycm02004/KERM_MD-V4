const { cmd } = require('../command');

let levels = {}; // Simple in-memory storage

cmd({
    pattern: "rank",
    desc: "Check the level of a user.",
    react: "📊",
    category: "utility",
    use: ".rank [@mention or reply]",
    filename: __filename
}, async (conn, mek, m, { reply, isGroup, mentionedJid }) => {
    try {
        let target = mentionedJid.length
            ? mentionedJid[0]
            : m.quoted?.sender
            ? m.quoted.sender
            : m.sender;

        if (!target) {
            return reply("❌ Please mention a user or reply to their message.");
        }

        if (!levels[target]) {
            levels[target] = { experience: 0, level: 0 }; // Initialize user data
        }

        levels[target].experience += 10; // Add XP for testing
        const level = Math.floor(0.1 * Math.sqrt(levels[target].experience)); // Calculate level

        reply(`👤 User: @${target.split("@")[0]}\n🔝 Level: ${level}\n✨ XP: ${levels[target].experience}`);
    } catch (err) {
        console.error("Rank command error:", err);
        reply("❌ An error occurred. Check logs for details.");
    }
});