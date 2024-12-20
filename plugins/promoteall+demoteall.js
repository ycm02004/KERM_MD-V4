const { cmd } = require('../command');


cmd({
    pattern: "promoteall",
    desc: "Promote all members of the group to admins.",
    react: "⬆️",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, groupMetadata, sender, reply }) => {
    try {
        // Vérifiez si la commande est utilisée dans un groupe
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        // Vérifiez si l'utilisateur est admin
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        
        // Vérifiez si le bot est admin
        if (!isBotAdmins) return reply("❌ I need to be an admin to promote members.");

        // Récupérez les participants du groupe
        const allParticipants = groupMetadata.participants;

        // Filtrez les membres qui ne sont pas déjà administrateurs
        const nonAdminMembers = allParticipants.filter(member => 
            !member.admin && member.id !== conn.user.jid
        );

        if (nonAdminMembers.length === 0) {
            return reply("✅ All members are already admins.");
        }

        reply("⏳ Promoting all members to admins...");

        // Promouvez chaque membre un par un
        for (let member of nonAdminMembers) {
            await conn.groupParticipantsUpdate(from, [member.id], "promote")
                .catch(err => console.error(`Failed to promote ${member.id}:`, err));
        }

        // Envoyez un message de confirmation, mentionnant l'utilisateur qui a effectué la promotion
        reply(`✅ All members have been promoted to admins by @${sender.split('@')[0]}!`, {
            mentions: [sender]
        });
    } catch (error) {
        console.error("Error promoting members:", error);
        reply("❌ An error occurred while promoting members. Please try again.");
    }
});
cmd({
    pattern: "demoteall",
    desc: "Demote all admins in the group (except bot and owner).",
    react: "⬇️",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, groupMetadata, sender, reply }) => {
    try {
        // Vérifiez si la commande est utilisée dans un groupe
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        // Vérifiez si l'utilisateur est admin
        if (!isAdmins) return reply("❌ Only group admins can use this command.");
        
        // Vérifiez si le bot est admin
        if (!isBotAdmins) return reply("❌ I need to be an admin to demote members.");

        // Récupérez les participants du groupe
        const allParticipants = groupMetadata.participants;

        // Filtrez les admins à retirer (les membres admins autres que le bot et l'owner)
        const adminsToDemote = allParticipants.filter(member => 
            member.admin && member.id !== conn.user.jid && member.id !== groupMetadata.owner
        );

        if (adminsToDemote.length === 0) {
            return reply("✅ No admins to demote.");
        }

        reply("⏳ Demoting all admins...");

        // Dégradez chaque admin un par un
        for (let member of adminsToDemote) {
            await conn.groupParticipantsUpdate(from, [member.id], "demote")
                .catch(err => console.error(`Failed to demote ${member.id}:`, err));
        }

        // Envoyer un message de confirmation avec le nom de l'utilisateur qui a effectué la commande
        reply(`✅ All admins have been demoted by @${sender.split('@')[0]}!`, {
            mentions: [sender]
        });
    } catch (error) {
        console.error("Error demoting members:", error);
        reply("❌ An error occurred while demoting admins. Please try again.");
    }
});
