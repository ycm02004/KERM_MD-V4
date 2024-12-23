const { cmd } = require('../command');

// In-memory storage for user levels (will reset every time the bot restarts)
let levels = {};

// Function to calculate level based on experience points
const calculateLevel = (xp) => Math.floor(0.1 * Math.sqrt(xp));

cmd({
    pattern: "rank",
    desc: "Check the level of a user in a group or private chat.",
    react: "📊",
    category: "utility",
    use: ".rank [@mention or reply]",
    filename: __filename
}, async (conn, mek, m, { reply, isGroup, mentionedJid }) => {
    try {
        // If a user is mentioned or the message is a reply, get the target user
        let target = mentionedJid.length
            ? mentionedJid[0]
            : m.quoted?.sender
            ? m.quoted.sender
            : m.sender;

        if (!target) {
            return reply("❌ Please mention a user or reply to their message to see their rank.");
        }

        // Initialize user data if it doesn't exist in memory
        if (!levels[target]) {
            levels[target] = { experience: 0, messages: 0, level: 0 };
        }

        const userData = levels[target];
        userData.messages += 1;  // Increase the number of messages sent by the user
        userData.experience += Math.floor(Math.random() * 10) + 5;  // Add random experience points to the user
        const newLevel = calculateLevel(userData.experience);

        // If the user reaches a new level, send a congratulatory message
        if (newLevel > userData.level) {
            userData.level = newLevel;

            // Send a congratulatory message every time the user reaches a level multiple of 20
            if (newLevel % 20 === 0) {
                conn.sendMessage(
                    m.chat,
                    { text: `🎉 Congratulations @${target.split("@")[0]}! You just reached level ${newLevel} 🚀`, mentions: [target] },
                    { quoted: mek }
                );
            }
        }

        // Calculate the XP required for the next level
        const nextLevelXP = Math.pow((newLevel + 1) / 0.1, 2);
        const currentLevelXP = Math.pow(newLevel / 0.1, 2);
        const progressPercent = Math.floor(((userData.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

        // Create a progress bar based on the user's progress
        const progressBar = "⭐".repeat(progressPercent / 10) + "⚪".repeat(10 - progressPercent / 10);

        // Generate an image URL to represent the level
        const levelImageURL = `https://via.placeholder.com/500x300.png?text=Level+${newLevel}`;
        
        // Prepare the caption with user rank details
        const caption = `📊 *User Rank*\n\n👤 *User*: @${target.split("@")[0]}\n🔝 *Level*: ${newLevel}\n🔄 *Progress*: ${progressPercent}%\n${progressBar}\n📩 *Messages Sent*: ${userData.messages}\n✨ *XP*: ${userData.experience}\n\nPOWERED BY KERM`;

        // Send the image with the rank details as a message
        conn.sendMessage(
            m.chat,
            { image: { url: levelImageURL }, caption, mentions: [target] },
            { quoted: mek }
        );
    } catch (error) {
        console.error("Error in Rank command:", error);
        reply("❌ An error occurred while fetching the rank. Please try again.");
    }
});
