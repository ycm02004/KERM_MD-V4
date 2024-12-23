const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Path to the levels JSON file
const levelsFile = path.resolve(__dirname, '../levels.json');

// Load or initialize the levels data
let levels = fs.existsSync(levelsFile) ? JSON.parse(fs.readFileSync(levelsFile)) : {};

// Function to save the levels data back to the file
const saveLevels = () => {
    fs.writeFileSync(levelsFile, JSON.stringify(levels, null, 2));
};

// Function to calculate level based on experience (XP)
const calculateLevel = (xp) => Math.floor(0.1 * Math.sqrt(xp));

// Define the "rang" command to check rank and level
cmd({
    pattern: "rang",
    desc: "Check the level of a user in a group or private chat.",
    react: "📊",
    category: "utility",
    use: ".rang [@mention or reply]",
    filename: __filename
}, async (conn, mek, m, { reply, isGroup, mentionedJid }) => {
    try {
        // Get the target user (mentioned or replied user)
        let target = mentionedJid.length
            ? mentionedJid[0]
            : m.quoted?.sender
            ? m.quoted.sender
            : m.sender;

        if (!target) {
            return reply("❌ Please mention a user or reply to their message to see their rank.");
        }

        // Initialize user data if it doesn't exist
        if (!levels[target]) {
            levels[target] = { experience: 0, messages: 0, level: 0 };
        }

        const userData = levels[target];
        userData.messages += 1;
        userData.experience += Math.floor(Math.random() * 10) + 5;  // Random XP gain per message
        const newLevel = calculateLevel(userData.experience);

        // Congratulate the user if they reach a new level
        if (newLevel > userData.level) {
            userData.level = newLevel;

            // Send a congratulatory message if the user reaches a level multiple of 20
            if (newLevel % 20 === 0) {
                conn.sendMessage(
                    m.chat,
                    { text: `🎉 Congratulations @${target.split("@")[0]} !\nYou just reached level ${newLevel} 🚀`, mentions: [target] },
                    { quoted: mek }
                );
            }
        }

        // Calculate XP required for the next level and the progress bar
        const nextLevelXP = Math.pow((newLevel + 1) / 0.1, 2);
        const currentLevelXP = Math.pow(newLevel / 0.1, 2);
        const progressPercent = Math.floor(((userData.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
        const progressBar = "⭐".repeat(progressPercent / 10) + "⚪".repeat(10 - progressPercent / 10);

        // Placeholder image URL for the user's level
        const levelImageURL = `https://via.placeholder.com/500x300.png?text=Level+${newLevel}`;
        
        // Caption message with level info
        const caption = `📊 *User's Rank*\n\n👤 *User*: @${target.split("@")[0]}\n🔝 *Level*: ${newLevel}\n🔄 *Progress*: ${progressPercent}%\n${progressBar}\n📩 *Messages sent*: ${userData.messages}\n✨ *XP*: ${userData.experience}\n\n> 🧞‍♂️POWERED BY KERM🧞‍♂️`;

        // Send the rank image with the caption to the chat
        conn.sendMessage(
            m.chat,
            { image: { url: levelImageURL }, caption, mentions: [target] },
            { quoted: mek }
        );

        // Save the updated levels data to JSON
        saveLevels();
    } catch (error) {
        console.error("Error in Rang command:", error);
        reply("❌ An error occurred while fetching the rank. Please try again.");
    }
});