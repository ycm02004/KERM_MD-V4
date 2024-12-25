
























const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "ig",
    alias: ["instagram", "igstalk"],
    desc: "Fetch Instagram profile details.",
    category: "tools",
    react: "📸",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Vérifiez si un nom d'utilisateur est fourni
        if (args.length === 0) {
            return reply(`❗ *Please provide an Instagram username.*\n\n*Example:*\n.ig silentlover432`);
        }

        const username = args[0]; // Récupérer le nom d'utilisateur
        const apiUrl = `https://www.guruapi.tech/api/igstalk?username=${username}`;
        
        // Appel API
        const response = await axios.get(apiUrl);
        const data = response.data;

        // Vérifiez si les données sont valides
        if (!data || data.status !== "success") {
            return reply(`❌ *No details found for username:* ${username}`);
        }

        // Format et affichage des résultats
        const profile = data.data;
        const result = `📸 *Instagram Profile Details:*\n\n` +
                       `👤 *Username:* ${profile.username}\n` +
                       `📛 *Full Name:* ${profile.full_name || "N/A"}\n` +
                       `📝 *Bio:* ${profile.biography || "N/A"}\n` +
                       `🌐 *Followers:* ${profile.followers_count}\n` +
                       `🧑‍🤝‍🧑 *Following:* ${profile.following_count}\n` +
                       `📸 *Posts:* ${profile.posts_count}\n` +
                       `🔗 *Profile Link:* [Visit Profile](https://instagram.com/${profile.username})\n\n` +
                       `💡 *Private Account:* ${profile.is_private ? "Yes 🔒" : "No 🔓"}\n` +
                       `👑 *Verified Account:* ${profile.is_verified ? "Yes ✅" : "No ❌"}`;

        // Envoi du message avec l'image de profil
        await conn.sendMessage(m.chat, {
            image: { url: profile.profile_pic_url_hd },
            caption: result
        }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply(`⚠️ *An error occurred while fetching Instagram profile details.*\n\n${error.message}`);
    }
});