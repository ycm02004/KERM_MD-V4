/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/




const { cmd } = require('../command');
let antideleteStatus = {}; // Tracks the ON/OFF status for each chat


cmd({
    pattern: "channel",
    desc: "Send an invitation to join the WhatsApp channel.",
    react: "🔗",
    category: "utility",
    use: ".channel",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        // Remplacez par le JID de votre chaîne WhatsApp
        const channelJid = "120363321386877609@newsletter"; // Exemple de JID pour la chaîne

        // Message d'invitation à envoyer à l'utilisateur
        const inviteMessage = `🔔 *Rejoignez notre chaîne WhatsApp !*\n\nRecevez les dernières mises à jour et annonces.\n\n👉 Cliquez sur le lien ci-dessous pour rejoindre :\nhttps://wa.me/${channelJid}`;

        // Envoyer le message à l'utilisateur
        await reply(inviteMessage);
    } catch (error) {
        console.error("Error while sending channel invitation:", error.message);
        reply("❌ Une erreur s'est produite lors de l'envoi de l'invitation. Veuillez réessayer.");
    }
});
// Command for sending the support group or page link
cmd({
    pattern: "support",
    desc: "Get the link to the support group or page.",
    react: "🛠️",
    category: "utility",
    use: ".support",
    filename: __filename,
}, async (conn, mek, m, { reply }) => {
    try {
        // Define the support link inside the command
        const supportLink = "https://chat.whatsapp.com/L5MM9j04Caz4y2EZHRnD1Z";

        // Send the support link to the user
        reply(`Need help 💁🏽 or have questions ? Join kerm support group:\n\n${supportLink}\n\n> Feel free to ask your questions or report issues🙇🏽.`);
    } catch (error) {
        // Log and notify about any errors
        console.error("Error sending support link:", error.message);
        reply("❌ Sorry, an error occurred while trying to send the support link.");
    }
});