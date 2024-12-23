const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Load or initialize levels.json
const levelsFile = path.resolve(__dirname, '../levels.json');
let levels = fs.existsSync(levelsFile) ? JSON.parse(fs.readFileSync(levelsFile)) : {};

// Function to save levels to JSON file asynchronously
const saveLevels = async () => {
    fs.writeFile(levelsFile, JSON.stringify(levels, null, 2), (err) => {
        if (err) console.error("Error saving levels:", err.message);
    });
};

// Function to calculate the level based on XP
const calculateLevel = (xp) => Math.floor(0.1 * Math.sqrt(xp));

// Define the rank command
cmd({
    pattern: "rank", // Command trigger
    desc: "Check the level of a user in a group or private chat.", // Command description
    react: "📊", // Reaction emoji
    category: "utility", // Command category
    use: ".rank [@mention or reply]", // Command usage guide
    filename: __filename, // File name reference
}, async (conn, mek, m, { reply, isGroup, mentionedJid }) => {
    try {
        // Determine the target user (mentioned, replied-to, or the sender)
        let target = mentionedJid.length
            ? mentionedJid[0]
            : m.quoted?.sender
            ? m.quoted.sender
            : m.sender;

        if (!target) {
            return reply("❌ Please mention a user or reply to their message to see their rank.");
        }

        // Initialize user data if it doesn't already exist
        if (!levels[target]) {
            levels[target] = { experience: 0, messages: 0, level: 0 };
        }

        const userData = levels[target];
        userData.messages += 1; // Increment message count
        userData.experience += Math.floor(Math.random() * 10) + 5; // Add random XP
        const newLevel = calculateLevel(userData.experience); // Calculate new level

        // Calculate XP required for the next level
        const nextLevelXP = Math.pow((newLevel + 1) / 0.1, 2);
        const currentLevelXP = Math.pow(newLevel / 0.1, 2);
        const progressPercent = Math.floor(((userData.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

        // Create a progress bar for the level
        const progressBar = "⭐".repeat(progressPercent / 10) + "⚪".repeat(10 - progressPercent / 10);

        // Create the caption for the rank message
        const caption = `📊 *User Rank*\n\n👤 *User*: @${
            target.split("@")[0]
        }\n🔝 *Level*: ${newLevel}\n🔄 *Progress*: ${progressPercent}%\n${progressBar}\n📩 *Messages Sent*: ${userData.messages}\n✨ *XP*: ${userData.experience}\n\nPOWERED BY KERM`;

        // Send the rank details with the image immediately
        const rankImageURL = "https://i.imgur.com/8eV6kMk.png";
        conn.sendMessage(
            m.chat,
            { image: { url: rankImageURL }, caption, mentions: [target] },
            { quoted: mek }
        );

        // Notify the user if they reach a level multiple of 20
        if (newLevel > userData.level && newLevel % 20 === 0) {
            userData.level = newLevel; // Update the level
            conn.sendMessage(
                m.chat,
                {
                    image: { url: rankImageURL },
                    caption: `🎉 Congratulations @${target.split("@")[0]}!\nYou have reached level ${newLevel} 🚀\nPOWERED BY KERM`,
                    mentions: [target]
                },
                { quoted: mek }
            );
        }

        // Save the updated user data to levels.json asynchronously
        saveLevels();
    } catch (error) {
        // Log the error and notify the user
        console.error("Error in Rank command:", error.message);
        reply("❌ An error occurred. Please try again.");
    }
});