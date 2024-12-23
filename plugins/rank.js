const { cmd } = require('../command');
const fs = require('fs');

// Simulated data storage for user ranks
const ranks = {};

// Function to calculate level based on experience
const calculateLevel = (xp) => Math.floor(0.1 * Math.sqrt(xp));

cmd({
    pattern: "rank",
    alias: ["level, "levels"],
    desc: "Check the rank of a user in a group or private chat.",
    react: "📊",
    category: "utility",
    use: ".rank [mention or reply]",
    filename: __filename,
}, async (conn, mek, m, { reply, isGroup, mentionedJid }) => {
    try {
        // Determine the target user
        let target = mentionedJid.length
            ? mentionedJid[0]
            : m.quoted?.sender
            ? m.quoted.sender
            : m.sender;

        if (!target) {
            return reply("❌ Please mention a user or reply to their message to see their rank.");
        }

        // Initialize rank data for the target if not existing
        if (!ranks[target]) {
            ranks[target] = { xp: 0, messages: 0, level: 0 };
        }

        // Update user stats
        const user = ranks[target];
        user.messages += 1;
        user.xp += Math.floor(Math.random() * 10) + 5;
        const newLevel = calculateLevel(user.xp);

        if (newLevel > user.level) {
            user.level = newLevel;
        }

        // Progress calculations
        const currentLevelXP = Math.pow(user.level / 0.1, 2);
        const nextLevelXP = Math.pow((user.level + 1) / 0.1, 2);
        const progressPercent = Math.floor(((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
        const progressBar = "⭐".repeat(progressPercent / 10) + "⚪".repeat(10 - progressPercent / 10);

        // Caption with rank details
        const caption = `📊 *User Rank*\n\n👤 *User*: @${
            target.split("@")[0]
        }\n🔝 *Level*: ${user.level}\n🔄 *Progression*: ${progressPercent}%\n${progressBar}\n📩 *Messages Sent*: ${user.messages}\n✨ *XP*: ${user.xp}\n\n> 🧞‍♂️POWERED BY KERM🧞‍♂️`;

        // Send the image with the rank details
        conn.sendMessage(
            m.chat,
            {
                image: { url: "https://i.imgur.com/8eV6kMk.png" }, // Image link provided
                caption,
                mentions: [target],
            },
            { quoted: mek }
        );
    } catch (error) {
        console.error("Error in Rank command:", error.message);
        reply("❌ An error occurred. Please try again.");
    }
});