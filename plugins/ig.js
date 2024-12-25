


















const axios = require("axios"); // Importation d'axios pour les requêtes HTTP
const { cmd } = require("../command"); // Gestionnaire de commandes

cmd({
    pattern: "ig", // Commande pour Instagram
    alias: ["igstalk", "instainfo"], // Alias de la commande
    react: "⏳",
    desc: "Fetch Instagram profile details using username.", // Description
    category: "social", // Catégorie
    react: "📷", // Emoji de réaction
    filename: __filename, // Nom du fichier
}, async (conn, mek, m, { text, reply }) => {
    try {
        // Vérifiez si un nom d'utilisateur est fourni
        if (!text) {
            return reply("Please provide an Instagram username to stalk.\nExample: .ig username");
        }

        // URL de l'API avec le nom d'utilisateur
        const apiUrl = `https://www.guruapi.tech/api/igstalk?username=${encodeURIComponent(text.trim())}`;

        // Envoi de la requête à l'API
        const response = await axios.get(apiUrl);

        // Vérifiez si la réponse contient les données nécessaires
        if (!response.data || !response.data.result) {
            return reply("Error fetching profile details. Please check the username or try again later.");
        }

        // Extraire les informations de l'utilisateur
        const {
            username,
            full_name,
            bio,
            followers,
            following,
            posts,
            profile_pic_url_hd,
            is_private,
            is_verified,
        } = response.data.result;

        // Préparer le message à envoyer avec des emojis
        const profileInfo = `
*📸 Instagram Profile Stalker*

> *👤 Username:* ${username}
> *🧑‍🤝‍🧑 Full Name:* ${full_name || "N/A"}
> *📝 Bio:* ${bio || "N/A"}
> *👥 Followers:* ${followers || "N/A"}
> *📊 Following:* ${following || "N/A"}
> *🖼️ Posts:* ${posts || "N/A"}
> *✅ Verified:* ${is_verified ? "Yes" : "No"}
> *🔒 Private Account:* ${is_private ? "Yes" : "No"}

> *© BY YOUR_BOT_NAME*
        `;

        // Envoyer la photo de profil et les détails
        await conn.sendMessage(m.chat, {
            image: { url: profile_pic_url_hd },
            caption: profileInfo,
        }, { quoted: mek });

    } catch (error) {
        console.error("Instagram Stalker Error:", error.message);
        reply("An error occurred while fetching Instagram details. Please try again later.");
    }
});