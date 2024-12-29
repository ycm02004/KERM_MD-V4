let stickerCommands = {}; // Stockage temporaire en mémoire

const { cmd } = require('../command');

cmd({
    pattern: "setcmd",
    desc: "Link a sticker to a command (Owner only)",
    category: "owner",
    use: ".setcmd [command]",
    react: "✅",
    filename: __filename
},
async (conn, m, { reply, quoted, args, isOwner }) => {
    if (!isOwner) return reply('❌ This command is restricted to the bot owner.');
    if (!quoted || quoted.mtype !== 'stickerMessage') {
        return reply('❌ Please reply to a sticker to set a command.');
    }

    const command = args.join(' ');
    if (!command) return reply('❌ Please specify the command to link with the sticker.');

    // Generate a unique key for the sticker
    const stickerId = quoted.fileSha256.toString('hex');
    stickerCommands[stickerId] = command; // Link sticker to the command

    reply(`✅ Sticker linked to command: *${command}*`);
});

// Automatically execute linked commands when a sticker is sent
cmd({
    pattern: ".*", // Match all messages (to check for stickers)
    desc: "Execute commands linked to stickers",
    category: "fun",
    react: null,
    filename: __filename
},
async (conn, m, { isCmd }) => {
    if (m.mtype === 'stickerMessage') {
        const stickerId = m.fileSha256.toString('hex');
        if (stickerCommands[stickerId]) {
            const linkedCommand = stickerCommands[stickerId];
            m.text = linkedCommand; // Simulate the command as if it was typed
            await conn.executeCommand(m); // Execute the linked command
        }
    }
});
cmd({
    pattern: "delcmd", // Command name
    desc: "Delete a command associated with a sticker",
    category: "owner", // Command category
    use: '.delcmd', // Example usage
    react: "🗑️", // Reaction added
    filename: __filename
},
async (conn, mek, m, { from, l, isOwner, quoted, reply }) => {
    try {
        // Check if the user is the owner
        if (!isOwner) return reply('❌ This command is only available for the bot owner.');

        // Check if the user replied to a sticker
        if (!quoted || quoted.mtype !== 'stickerMessage') {
            return reply('❌ You need to reply to a sticker to use this command.');
        }

        // Get the sticker's unique ID
        const stickerId = quoted.fileSha256.toString('base64');

        // Check if there is a command associated with this sticker
        if (!stickerCommands[stickerId]) {
            return reply('❌ No command is associated with this sticker.');
        }

        // Delete the association
        delete stickerCommands[stickerId];
        reply('✅ The command associated with this sticker has been successfully deleted.');
    } catch (e) {
        console.error(e);
        reply('❌ An error occurred while processing your request.');
    }
});

// Example of `stickerCommands` object:
// {
//   'sticker_id_1': 'command_1',
//   'sticker_id_2': 'command_2'
// }