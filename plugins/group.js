






































const { cmd } = require("../command");

cmd({
    pattern: "kick",
    desc: "Kick a member from the group by mentioning them or replying to their message.",
    category: "admin",
    react: "🚪",
    filename: __filename
}, async (conn, mek, m, { text, isGroup, isBotAdmin, isAdmin, reply }) => {
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    if (!isAdmin) {
        return reply("❌ *You must be an admin to use this command.*");
    }

    if (!isBotAdmin) {
        return reply("❌ *I need admin privileges to perform this action.*");
    }

    let userId;

    if (m.quoted) {
        // Si l'utilisateur répond à un message
        userId = m.quoted.sender;
    } else if (text) {
        // Si un utilisateur est mentionné
        const mentioned = m.mentions[0];
        if (!mentioned) {
            return reply("❌ *Please mention a user or reply to their message to kick them.*");
        }
        userId = mentioned;
    } else {
        return reply("❌ *Please mention a user or reply to their message to kick them.*");
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [userId], "remove");
        reply(`✅ *Successfully removed the user.*`);
    } catch (error) {
        console.error(error);
        reply("❌ *Failed to remove the user. Please try again.*");
    }
});
cmd({
    pattern: "leave",
    alias: ["left"],
    desc: "Make the bot leave the group. Only the owner can use this command.",
    category: "owner",
    react: "👋",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, reply }) => {
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    if (!isOwner) {
        return reply("❌ *Only the bot owner can use this command.*");
    }

    try {
        // Envoi du message d'au revoir
        await conn.sendMessage(m.chat, { text: "👋 *Goodbye, everyone! It was great being here!*" });

        // Quitte le groupe
        await conn.groupLeave(m.chat);

        console.log(`Bot left the group: ${m.chat}`);
    } catch (error) {
        console.error(error);
        reply("❌ *Failed to leave the group. Please try again.*");
    }
});
cmd({
    pattern: "tagall",
    desc: "Tag all members in the group with numbering and emojis.",
    category: "group",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { isGroup, groupMetadata, participants, reply }) => {
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    try {
        const members = participants.map((member, index) => {
            const emoji = ["🔥", "💎", "🌟", "✨", "🚀", "🍀", "🌈", "🎯", "🎉", "🌻"];
            const chosenEmoji = emoji[index % emoji.length]; // Cycle through emojis
            return `*${index + 1}. ${chosenEmoji}* @${member.id.split('@')[0]}`;
        });

        const message = `*HEY EVERYONE! 👋*\n\n${members.join('\n')}`;
        
        await conn.sendMessage(m.chat, { text: message, mentions: participants.map(p => p.id) }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ *An error occurred while tagging members. Please try again.*");
    }
});
cmd({
    pattern: "add",
    desc: "Add a member to the group by number or from a replied message.",
    category: "group",
    react: "➕",
    filename: __filename
}, async (conn, mek, m, { isGroup, isBotAdmin, sender, isOwner, quoted, reply, args }) => {
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }
    if (!isOwner) {
        return reply("❌ *Only the owner can use this command.*");
    }
    if (!isBotAdmin) {
        return reply("❌ *I need to be an admin to add members.*");
    }

    try {
        let number;
        if (quoted && quoted.sender) {
            number = quoted.sender.split("@")[0];
        } else if (args[0]) {
            number = args[0].replace(/[^0-9]/g, ""); // Supprime tous les caractères non numériques
        } else {
            return reply("❌ *Please provide a phone number or reply to a user's message to add them.*\n\n*Example:* .add 1234567890");
        }

        const countryCode = "237"; // Change this to your default country code
        const fullNumber = number.includes("@s.whatsapp.net") ? number : `${countryCode}${number}@s.whatsapp.net`;

        // Ajout de l'utilisateur
        await conn.groupParticipantsUpdate(m.chat, [fullNumber], "add")
            .then(() => reply(`✅ *Successfully added:* @${number}`))
            .catch((err) => {
                console.error(err);
                reply("❌ *Failed to add the user. This may be due to privacy settings or other restrictions.*");
            });

        // Message de conseils
        await conn.sendMessage(m.chat, {
            text: `⚠️ *Please avoid overusing the add command to prevent account suspension.*`,
            mentions: [sender]
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ *An unexpected error occurred. Please try again later.*");
    }
});
cmd({
    pattern: "promote",
    desc: "Promote a member to admin in the group.",
    category: "group",
    react: "📈",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, args, reply, participants, botNumber }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot
    if (m.sender !== botNumber) {
        return reply("❌ *Only the bot owner can use this command.*");
    }

    if (!args[0] && !mek.message.extendedTextMessage) {
        return reply("❌ *Please mention the person or reply to their message to promote them.*\n\n*Example:* .promote @username or reply to the user's message.");
    }

    let user;
    if (mek.message.extendedTextMessage) {
        // Si on répond à un message d'un utilisateur
        user = mek.message.extendedTextMessage.contextInfo.participant;
    } else if (args[0]) {
        // Si on mentionne un utilisateur
        user = args[0].replace(/[^\w\s@]/g, '').trim(); // Nettoie la mention
    }

    // Vérifie si l'utilisateur mentionné est dans le groupe
    if (!participants[user]) {
        return reply("❌ *This user is not in the group.*");
    }

    try {
        // Donner les privilèges d'admin à l'utilisateur
        await conn.groupParticipantsUpdate(m.chat, [user], "promote");
        reply(`✅ *${user} has been promoted to admin successfully! 🎉`);
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while promoting the user.*");
    }
});
cmd({
    pattern: "demote",
    desc: "Demote a member from admin in the group.",
    category: "group",
    react: "📉",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, args, reply, participants, botNumber }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot
    if (m.sender !== botNumber) {
        return reply("❌ *Only the bot owner can use this command.*");
    }

    if (!args[0] && !mek.message.extendedTextMessage) {
        return reply("❌ *Please mention the person or reply to their message to demote them.*\n\n*Example:* .demote @username or reply to the user's message.");
    }

    let user;
    if (mek.message.extendedTextMessage) {
        // Si on répond à un message d'un utilisateur
        user = mek.message.extendedTextMessage.contextInfo.participant;
    } else if (args[0]) {
        // Si on mentionne un utilisateur
        user = args[0].replace(/[^\w\s@]/g, '').trim(); // Nettoie la mention
    }

    // Vérifie si l'utilisateur mentionné est dans le groupe
    if (!participants[user]) {
        return reply("❌ *This user is not in the group.*");
    }

    try {
        // Retirer les privilèges d'admin de l'utilisateur
        await conn.groupParticipantsUpdate(m.chat, [user], "demote");
        reply(`✅ *${user} has been demoted from admin successfully! ⚠️`);
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while demoting the user.*");
    }
});
cmd({
    pattern: "invite",
    desc: "Generate and send the group invite link.",
    category: "group",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, reply, botNumber }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    try {
        // Récupérer le lien d'invitation du groupe
        const link = await conn.groupInviteCode(m.chat);
        
        // Envoi du lien d'invitation avec un petit message
        await conn.sendMessage(m.chat, {
            text: `Hey everyone! 👋\n\nHere is the invite link for this group: \n\nhttps://chat.whatsapp.com/${link}\n\nFeel free to share it! 😎`,
        });
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while fetching the invite link.*");
    }
});
cmd({
    pattern: "revoke",
    desc: "Revoke the current invite link of the group.",
    category: "group",
    react: "🔒",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, reply, botNumber }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    try {
        // Révoque le lien d'invitation du groupe
        await conn.groupRevokeInvite(m.chat);
        
        // Message confirmant la révocation du lien
        await reply("✅ *The group invite link has been revoked.*");
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while revoking the invite link.*");
    }
});
cmd({
    pattern: "approveall",
    desc: "Approve all pending participants in the group and mention them in one message.",
    category: "group",
    react: "✔️",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, reply, participants }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    try {
        // Obtenir les participants qui sont en attente (nouveaux membres à approuver)
        const pendingParticipants = participants.filter(p => p.status === 'pending');

        // Si il n'y a pas de participants à approuver
        if (!pendingParticipants || pendingParticipants.length === 0) {
            return reply("❌ *No participants to approve.*");
        }

        // Créer une liste des noms des participants à approuver
        const participantsList = pendingParticipants.map(p => `@${p.id.split('@')[0]}`).join(', ');

        // Message de bienvenue pour tous les participants approuvés
        await conn.sendMessage(m.chat, {
            text: `✅ *Welcome to the group!* 🎉\n\nThe following members have been approved:\n${participantsList}`
        }, { mentions: pendingParticipants.map(p => p.id) });

        reply("✅ *All participants have been approved and mentioned in a single message.*");
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while approving the participants.*");
    }
});
cmd({
    pattern: "rejectall",
    desc: "Reject all pending participants in the group and mention them in one message.",
    category: "group",
    react: "❌",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, reply, participants }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    try {
        // Obtenir les participants qui sont en attente (nouveaux membres à approuver)
        const pendingParticipants = participants.filter(p => p.status === 'pending');

        // Si il n'y a pas de participants à rejeter
        if (!pendingParticipants || pendingParticipants.length === 0) {
            return reply("❌ *No participants to reject.*");
        }

        // Créer une liste des noms des participants à rejeter
        const participantsList = pendingParticipants.map(p => `@${p.id.split('@')[0]}`).join(', ');

        // Message de rejet pour tous les participants
        await conn.sendMessage(m.chat, {
            text: `❌ *The following participants have been rejected:* 😔\n\n${participantsList}`
        }, { mentions: pendingParticipants.map(p => p.id) });

        reply("✅ *All participants have been rejected and mentioned in a single message.*");
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while rejecting the participants.*");
    }
});
cmd({
    pattern: "mute",
    desc: "Mute the group so only admins can send messages.",
    category: "group",
    react: "🔇",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, reply }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    // Ferme le groupe en rendant le chat accessible uniquement aux administrateurs
    try {
        // Modifie les paramètres du groupe pour que seuls les admins puissent envoyer des messages
        await conn.groupSettingUpdate(m.chat, "announcement", true);

        // Envoie le message de confirmation
        reply("🔇 *The group has been closed. Only admins can send messages now.*");

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while muting the group.*");
    }
});
cmd({
    pattern: "unmute",
    desc: "Unmute the group so all members can send messages.",
    category: "group",
    react: "🔊",
    filename: __filename
}, async (conn, mek, m, { isGroup, isOwner, isAdmin, reply }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    // Réactive l'envoi de messages pour tous les membres
    try {
        // Modifie les paramètres du groupe pour que tous les membres puissent envoyer des messages
        await conn.groupSettingUpdate(m.chat, "announcement", false);

        // Envoie le message de confirmation
        reply("🔊 *The group has been unmuted. All members can now send messages.*");

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while unmuting the group.*");
    }
});
cmd({
    pattern: "glock",
    desc: "Restrict group info modification to only admins.",
    category: "group",
    react: "🔒",
    filename: __filename
}, async (conn, mek, m, { isGroup, isAdmin, isOwner, reply }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    // Restreint les modifications des infos du groupe uniquement aux admins
    try {
        await conn.groupSettingUpdate(m.chat, "all", false);  // Empêche tout le monde (autre que les admins) de modifier les infos

        // Envoie le message de confirmation
        reply("🔒 *Group info modification is now restricted to admins only.*");

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while locking group info modification.*");
    }
});
cmd({
    pattern: "gunlock",
    desc: "Allow all members to modify group info again.",
    category: "group",
    react: "🔓",
    filename: __filename
}, async (conn, mek, m, { isGroup, isAdmin, isOwner, reply }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    // Rétablit les permissions de modification des infos du groupe pour tous les membres
    try {
        await conn.groupSettingUpdate(m.chat, "all", true);  // Permet à tous les membres de modifier les infos du groupe

        // Envoie le message de confirmation
        reply("🔓 *Group info modification is now allowed for all members.*");

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while unlocking group info modification.*");
    }
});
cmd({
    pattern: "gname",
    desc: "Change the group name.",
    category: "group",
    react: "✏️",
    filename: __filename
}, async (conn, mek, m, { isGroup, isAdmin, isOwner, args, reply }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    // Vérifie que le nom du groupe est bien spécifié
    if (!args.length) {
        return reply("❌ *Please provide a new group name.*\n*Example:* `.gname New Group Name`");
    }

    // Met à jour le nom du groupe avec le texte fourni
    try {
        const newGroupName = args.join(" ");  // Récupère le nom du groupe depuis les arguments
        await conn.groupUpdateSubject(m.chat, newGroupName);  // Modifie le nom du groupe

        // Envoie un message de confirmation
        reply(`✅ *Group name has been changed to:* ${newGroupName}`);

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while changing the group name.*");
    }
});
cmd({
    pattern: "gdesc",
    desc: "Change the group description.",
    category: "group",
    react: "✏️",
    filename: __filename
}, async (conn, mek, m, { isGroup, isAdmin, isOwner, args, reply }) => {
    // Vérifie si l'utilisateur est dans un groupe
    if (!isGroup) {
        return reply("❌ *This command can only be used in groups.*");
    }

    // Vérifie si le bot est admin dans le groupe
    if (!isAdmin) {
        return reply("❌ *The bot must be an admin in the group to use this command.*");
    }

    // Vérifie si l'utilisateur est le propriétaire du bot ou un admin du groupe
    if (!isOwner && !isAdmin) {
        return reply("❌ *Only the bot owner or group admins can use this command.*");
    }

    // Vérifie que la nouvelle description est bien spécifiée
    if (!args.length) {
        return reply("❌ *Please provide a new group description.*\n*Example:* `.gdesc Welcome to our amazing group!`");
    }

    // Met à jour la description du groupe avec le texte fourni
    try {
        const newDescription = args.join(" ");  // Récupère la description depuis les arguments
        await conn.groupUpdateDescription(m.chat, newDescription);  // Modifie la description du groupe

        // Envoie un message de confirmation
        reply(`✅ *Group description has been changed to successfully`);

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while changing the group description.*");
    }
});
cmd({
    pattern: "join",
    desc: "Allows the bot to join a group using an invite link.",
    category: "group",
    react: "🤖",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    // Vérifie si l'utilisateur est le propriétaire du bot
    if (!isOwner) {
        return reply("❌ *Only the owner can use this command.*");
    }

    // Vérifie si un lien est fourni
    if (!args.length) {
        return reply("❌ *Please provide a valid invite link.*\n*Example:* `.join https://chat.whatsapp.com/invite-link`");
    }

    const inviteLink = args[0];  // Récupère le lien d'invitation fourni

    // Essaie de faire rejoindre le bot au groupe via le lien
    try {
        await conn.groupAcceptInvite(inviteLink);  // Fait rejoindre le bot au groupe via l'invitation
        reply(`✅ *Bot has successfully joined the group using the invite link:* ${inviteLink}`);
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while trying to join the group. Please check the invite link or try again later.*");
    }
});
cmd({
    pattern: "tag",
    alias: ["hidetag"],
    desc: "Tag all group members without displaying the mention.",
    category: "group",
    react: "✍️",
    filename: __filename
}, async (conn, mek, m, { isOwner, isAdmin, reply, participants }) => {
    // Vérifie si l'utilisateur est admin ou propriétaire
    if (!(isOwner || isAdmin)) {
        return reply("❌ *Only the admin or owner can use this command.*");
    }

    // Récupère le texte de la commande, soit le message cité soit le texte après la commande
    let messageText = m.quoted ? m.quoted.text : m.text.slice(5).trim();

    if (!messageText) {
        return reply("❌ *Please reply to a message or provide text after the command to tag.*");
    }

    // Liste des membres du groupe
    const mentions = participants.map(member => member.id);

    // Création du message avec texte et mention cachée
    const tagMessage = `${messageText}`;

    // Envoi du message dans le groupe, en mentionnant tous les membres mais sans afficher la mention
    try {
        await conn.sendMessage(m.chat, {
            text: tagMessage,
            mentions: mentions
        }, { quoted: mek });
    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while trying to send the tag message. Please try again later.*");
    }
});
cmd({
    pattern: "ginfo",
    desc: "Get information about the current group.",
    category: "group",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { isOwner, isAdmin, reply }) => {
    try {
        // Vérifie que l'utilisateur est un admin ou le propriétaire
        if (!(isOwner || isAdmin)) {
            return reply("❌ *Only admins or the owner can use this command.*");
        }

        // Si ce n'est pas un groupe, retourne un message d'erreur
        if (!m.isGroup) {
            return reply("❌ *This command can only be used in groups.*");
        }

        // Si c'est un groupe
        const groupMetadata = await conn.groupMetadata(m.chat);
        const groupName = groupMetadata.subject;
        const groupDesc = groupMetadata.desc || "No description set.";
        const participantCount = groupMetadata.participants.length;
        const creationDate = new Date(groupMetadata.creation * 1000).toLocaleString(); // Convertit en format lisible
        const admins = groupMetadata.participants.filter(member => member.admin === "admin").map(admin => admin.id);

        // Prépare le message d'information pour un groupe
        let groupInfo = `*Group Info for: ${groupName}*\n`;
        groupInfo += `*Description:* ${groupDesc}\n`;
        groupInfo += `*Participants:* ${participantCount}\n`;
        groupInfo += `*Created on:* ${creationDate}\n`;
        groupInfo += `*Admins:* ${admins.length > 0 ? admins.join(", ") : "No admins"}\n`;

        // Envoie les informations dans le chat
        await conn.sendMessage(m.chat, {
            text: groupInfo
        }, { quoted: mek });

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while fetching the information. Please try again later.*");
    }
});
cmd({
    pattern: "ephemeral",
    desc: "Enable or disable ephemeral messages in the group or chat.",
    category: "group",
    react: "🕒",
    filename: __filename
}, async (conn, mek, m, { isOwner, isAdmin, reply }) => {
    try {
        // Vérifie si l'utilisateur est un admin ou le propriétaire
        if (!(isOwner || isAdmin)) {
            return reply("❌ *Only admins or the owner can use this command.*");
        }

        // Si c'est un chat privé, la commande est valable uniquement pour l'owner
        if (!m.isGroup && !isOwner) {
            return reply("❌ *This command can only be used in groups or by the owner in private chats.*");
        }

        // Vérifie si l'utilisateur a fourni une valeur (ON ou OFF)
        const args = m.text.split(" ");
        if (args.length < 2 || !["ON", "OFF"].includes(args[1].toUpperCase())) {
            return reply("❌ *Please specify ON or OFF to enable or disable ephemeral messages.*\n*Example:* `.ephemeral ON` or `.ephemeral OFF`");
        }

        const ephemeralState = args[1].toUpperCase() === "ON" ? true : false;

        // Si c'est un groupe
        if (m.isGroup) {
            // Active ou désactive les messages éphémères pour ce groupe
            await conn.groupSettingUpdate(m.chat, ephemeralState ? 'ephemeral' : 'unlocked');
            const state = ephemeralState ? "enabled" : "disabled";
            reply(`✅ *Ephemeral messages have been ${state} in this group.*`);
        }
        // Si c'est une discussion privée
        else {
            await conn.sendMessage(m.chat, { text: ephemeralState ? 'Ephemeral messages are now enabled.' : 'Ephemeral messages are now disabled.' });
            const state = ephemeralState ? "enabled" : "disabled";
            reply(`✅ *Ephemeral messages have been ${state} in this chat.*`);
        }

    } catch (error) {
        console.log(error);
        reply("❌ *An error occurred while updating the ephemeral message settings. Please try again later.*");
    }
});