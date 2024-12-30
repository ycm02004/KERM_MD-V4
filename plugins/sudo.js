const { cmd } = require('../command');
const fs = require('fs');
const config = ('../config');




// File path to store the sudo list
const sudoFilePath = './sudo.json';
let sudoList = [];

// Load existing sudo list on startup
if (fs.existsSync(sudoFilePath)) {
    sudoList = JSON.parse(fs.readFileSync(sudoFilePath, 'utf-8'));
}

// Function to save sudo list to file
const saveSudoList = () => fs.writeFileSync(sudoFilePath, JSON.stringify(sudoList, null, 2));

// Function to check if a number is sudo
const isSudo = (number) => sudoList.includes(number);

// Command: setsudo
cmd({
    pattern: "setsudo",
    desc: "Add a user as sudo (by reply or number)",
    category: "admin",
    use: ".setsudo [number] (or reply to a message)",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply, quoted }) => {
    try {
        // Check if the user is the owner
        if (!m.isOwner) return reply("❌ Only the owner can use this command.");

        // Get the target number
        let target = args[0]?.replace(/[^\d]/g, '');
        if (!target && quoted) target = quoted.sender.split('@')[0];

        // Validate the target
        if (!target) return reply("❌ Please provide a valid number or reply to a message.");
        if (isSudo(target)) return reply(`✅ ${target} is already a sudo user.`);

        // Add the number to the sudo list
        sudoList.push(target);
        saveSudoList();
        reply(`✅ Number ${target} added as a sudo user.`);
    } catch (e) {
        console.error("Error in setsudo:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});

// Command: delsudo
cmd({
    pattern: "delsudo",
    desc: "Remove a user from sudo (by reply or number)",
    category: "admin",
    use: ".delsudo [number] (or reply to a message)",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { args, sender, reply, quoted }) => {
    try {
        // Check if the user is the owner
        if (!m.isOwner) return reply("❌ Only the owner can use this command.");

        // Get the target number
        let target = args[0]?.replace(/[^\d]/g, '');
        if (!target && quoted) target = quoted.sender.split('@')[0];

        // Validate the target
        if (!target) return reply("❌ Please provide a valid number or reply to a message.");
        if (!isSudo(target)) return reply(`❌ ${target} is not a sudo user.`);

        // Remove the number from the sudo list
        sudoList = sudoList.filter(num => num !== target);
        saveSudoList();
        reply(`✅ Number ${target} removed from sudo users.`);
    } catch (e) {
        console.error("Error in delsudo:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
// Command: getsudo
cmd({
    pattern: "getsudo",
    desc: "Get the list of all sudo users",
    category: "admin",
    use: ".getsudo",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { reply, isOwner }) => {
    try {
        // Check if the user is the owner
        if (!isOwner) return reply("❌ Only the owner can use this command.");

        // Check if the sudo list is empty
        if (sudoList.length === 0) return reply("📜 No sudo users have been added yet.");

        // Format the list for display
        let sudoUsers = sudoList.map((num, i) => `${i + 1}. ${num}`).join('\n');
        reply(`📜 *Sudo Users List:*\n\n${sudoUsers}`);
    } catch (e) {
        console.error("Error in getsudo:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});