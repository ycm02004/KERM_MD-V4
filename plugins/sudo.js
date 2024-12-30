const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

// Chemin du fichier sudo.json
const sudoPath = path.resolve(__dirname, '../sudo.json');

// Commande Setsudo
cmd({
    pattern: "setsudo",
    react: "➕",
    desc: "Add a user to the sudo list",
    category: "admin",
    use: ".setsudo @user or reply",
    filename: __filename
}, async (conn, mek, m, { sender, reply, args, quoted }) => {
    try {
        // Logs pour le debugging
        console.log("Sender detected:", sender);
        console.log("Owner list from config:", config.owners);

        // Vérification si l'utilisateur est l'owner
        if (!config.owners.includes(sender)) {
            return reply("❌ Only the owner can use this command.");
        }

        // Récupération de l'utilisateur ciblé (soit via mention, soit réponse)
        let target = args[0]?.replace(/[@\s]/g, '') + "@s.whatsapp.net";
        if (quoted && quoted.sender) {
            target = quoted.sender;
        }

        if (!target) {
            return reply("❌ Please mention a user or reply to their message.");
        }

        // Chargement ou création du fichier sudo.json
        let sudoList = [];
        if (fs.existsSync(sudoPath)) {
            sudoList = JSON.parse(fs.readFileSync(sudoPath, 'utf-8'));
        }

        // Vérification si l'utilisateur est déjà sudo
        if (sudoList.includes(target)) {
            return reply("⚠️ User is already in the sudo list.");
        }

        // Ajout de l'utilisateur à la liste
        sudoList.push(target);
        fs.writeFileSync(sudoPath, JSON.stringify(sudoList, null, 2));
        reply(`✅ ${target.split('@')[0]} has been added to the sudo list.`);
    } catch (e) {
        console.error("Error in setsudo command:", e);
        reply("❌ An error occurred while processing your request.");
    }
});

// Commande Delsudo
cmd({
    pattern: "delsudo",
    react: "➖",
    desc: "Remove a user from the sudo list",
    category: "admin",
    use: ".delsudo @user or reply",
    filename: __filename
}, async (conn, mek, m, { sender, reply, args, quoted }) => {
    try {
        // Logs pour le debugging
        console.log("Sender detected:", sender);
        console.log("Owner list from config:", config.owners);

        // Vérification si l'utilisateur est l'owner
        if (!config.owners.includes(sender)) {
            return reply("❌ Only the owner can use this command.");
        }

        // Récupération de l'utilisateur ciblé (soit via mention, soit réponse)
        let target = args[0]?.replace(/[@\s]/g, '') + "@s.whatsapp.net";
        if (quoted && quoted.sender) {
            target = quoted.sender;
        }

        if (!target) {
            return reply("❌ Please mention a user or reply to their message.");
        }

        // Chargement du fichier sudo.json
        if (!fs.existsSync(sudoPath)) {
            return reply("⚠️ No sudo users found.");
        }
        let sudoList = JSON.parse(fs.readFileSync(sudoPath, 'utf-8'));

        // Vérification si l'utilisateur est dans la liste
        if (!sudoList.includes(target)) {
            return reply("⚠️ User is not in the sudo list.");
        }

        // Suppression de l'utilisateur
        sudoList = sudoList.filter(user => user !== target);
        fs.writeFileSync(sudoPath, JSON.stringify(sudoList, null, 2));
        reply(`✅ ${target.split('@')[0]} has been removed from the sudo list.`);
    } catch (e) {
        console.error("Error in delsudo command:", e);
        reply("❌ An error occurred while processing your request.");
    }
});