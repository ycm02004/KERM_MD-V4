const { cmd } = require('../command');

// In-memory storage for levels
let levels = {};

// Command definition
cmd({
    pattern: "rank",
    desc: "Check the level and experience of a user.",
    react: "📊",
    category: "utility",
    use: ".rank [@mention or reply]",
    filename: __filename
}, async (conn, mek, m, { reply, isGroup, mentionedJid }) => {
    try {
        // Find the target user (mention, reply, or self)
        let target = mentionedJid.length
            ? mentionedJid[0]
            : m.quoted?.sender
            ? m.quoted.sender
            : m.sender;

        if (!target) {
            return reply("❌ Please mention a user or reply to their message.");
        }

        // Initialize user data if not present
        if (!levels[target]) {
            levels[target] = { experience: 0, level: 0 };
        }

        // Add XP and calculate level
        levels[target].experience += 10; // Add experience points
        levels[target].level = Math.floor(0.1 * Math.sqrt(levels[target].experience)); // Calculate level

        // Progression details
        const userData = levels[target];
        const nextLevelXP = Math.pow((userData.level + 1) / 0.1, 2);
        const currentLevelXP = Math.pow(userData.level / 0.1, 2);
        const progressPercent = Math.floor(((userData.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

        // Progress bar
        const progressBar = "⭐".repeat(progressPercent / 10) + "⚪".repeat(10 - progressPercent / 10);

        // Image URL (customize this to generate better images)
        const levelImageURL = `https://via.placeholder.com/500x300.png?text=Level+${userData.level}`;

        // Caption for the message
        const caption = 
            `🎖️ *Rank Details*\n` +
            `👤 *User*: @${target.split("@")[0]}\n` +
            `🔝 *Level*: ${userData.level}\n` +
            `✨ *XP*: ${userData.experience}\n` +
            `📊 *Progress*: ${progressPercent}%\n${progressBar}\n` +
            `\n> 🧞‍♂️POWERED BY KERM🧞‍♂️`;

        // Send rank details with image
        await conn.sendMessage(
            m.chat,
            { image: { url: levelImageURL }, caption, mentions: [target] },
            { quoted: mek }
        );
    } catch (err) {
        console.error("Error in rank command:", err);
        reply("❌ An error occurred. Please try again.");
    }
});