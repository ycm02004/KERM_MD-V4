const { cmd } = require('../command');

// Simulated in-memory storage for user levels
const userLevels = {};

// Function to calculate level based on XP
const calculateLevel = (xp) => Math.floor(0.1 * Math.sqrt(xp));

cmd({
    pattern: "rank",
    desc: "Check the level of a user.",
    react: "📊",
    category: "utility",
    use: ".rank [@mention or reply]",
    filename: __filename,
}, async (conn, mek, m, { reply, isGroup, mentionedJid }) => {
    try {
        let target;

        // Determine the target user
        if (mentionedJid?.length > 0) {
            target = mentionedJid[0]; // First mentioned user
        } else if (m.quoted && m.quoted.sender) {
            target = m.quoted.sender; // User who sent the quoted message
        } else {
            target = m.sender; // Default to the sender if no mention or reply
        }

        if (!target) {
            return reply("❌ Please mention a user or reply to their message to check their rank.");
        }

        // Initialize user data if not present
        if (!userLevels[target]) {
            userLevels[target] = { experience: 0, messages: 0 };
        }

        // Simulate experience gain
        const userData = userLevels[target];
        userData.messages += 1;
        userData.experience += Math.floor(Math.random() * 10) + 5;

        const level = calculateLevel(userData.experience);
        const nextLevelXP = Math.pow((level + 1) / 0.1, 2);
        const currentLevelXP = Math.pow(level / 0.1, 2);
        const progressPercent = Math.floor(((userData.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
        const progressBar = "⭐".repeat(progressPercent / 10) + "⚪".repeat(10 - progressPercent / 10);

        // Image URL for the level (optional)
        const levelImageURL = `https://via.placeholder.com/500x300.png?text=Level+${level}`;
        const caption = `📊 *Rank Information*\n\n👤 *User*: @${
            target.split("@")[0]
        }\n🔝 *Level*: ${level}\n🔄 *Progression*: ${progressPercent}%\n${progressBar}\n📩 *Messages Sent*: ${
            userData.messages
        }\n✨ *XP*: ${userData.experience}\n\nPOWERED BY KERM`;

        // Attempt to send the image with the caption
        try {
            await conn.sendMessage(
                m.chat,
                { image: { url: levelImageURL }, caption, mentions: [target] },
                { quoted: mek }
            );
        } catch (imageError) {
            console.error("Image generation failed:", imageError);

            // If the image fails, fallback to sending text-only message
            reply(caption);
        }
    } catch (error) {
        console.error("Error in rank command:", error);
        reply("❌ An error occurred while fetching the rank. Please try again.");
    }
});