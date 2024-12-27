const {cmd , commands} = require('../command');

cmd({
    pattern: "editorpack",
    desc: "Complete photo editor pack to apply various effects on images",
    category: "editor",
    react: "✅"
}, async (context, match, options) => {
    let response = `
        Welcome to the Editor Pack!
        Here are the available effects:
        
        1. RAINBOW
        2. JAIL
        3. GREYSCALE
        4. WASTED
    `;
    await context.reply(response);
});
cmd({
    pattern: "rainbow",
    desc: "Applies a rainbow effect to an image",
    category: "editor",
    react: "🌈"
}, async (context, match, options) => {
    try {
        if (!context.quoted) {
            return await context.reply("Please reply to an image to apply this effect.");
        }

        let downloadedMedia = await context.client.downloadMediaMessage(context.quoted);
        let imageUrl = await TelegraPh(downloadedMedia);
        let buffer = await getBuffer(`https://some-random-api.ml/canvas/rainbow?avatar=${imageUrl}`);

        await context.reply(buffer, { caption: "Effect applied successfully.", quoted: context }, 'image');
    } catch (error) {
        console.error(error);
        await context.reply("An error occurred while processing your request.");
    }
});
cmd({
    pattern: "jail",
    desc: "Applies a prison effect to an image",
    category: "editor",
    react: "🚔"
}, async (context, match, options) => {
    try {
        if (!context.quoted) {
            return await context.reply("Please reply to an image to apply this effect.");
        }

        let downloadedMedia = await context.client.downloadMediaMessage(context.quoted);
        let imageUrl = await TelegraPh(downloadedMedia);
        let buffer = await getBuffer(`https://some-random-api.ml/canvas/jail?avatar=${imageUrl}`);

        await context.reply(buffer, { caption: "Effect applied successfully.", quoted: context }, 'image');
    } catch (error) {
        console.error(error);
        await context.reply("An error occurred while processing your request.");
    }
});
cmd({
    pattern: "greyscale",
    desc: "Applies a greyscale (black and white) effect to an image",
    category: "editor",
    react: "⚫"
}, async (context, match, options) => {
    try {
        if (!context.quoted) {
            return await context.reply("Please reply to an image to apply this effect.");
        }

        let downloadedMedia = await context.client.downloadMediaMessage(context.quoted);
        let imageUrl = await TelegraPh(downloadedMedia);
        let buffer = await getBuffer(`https://some-random-api.ml/canvas/greyscale?avatar=${imageUrl}`);

        await context.reply(buffer, { caption: "Effect applied successfully.", quoted: context }, 'image');
    } catch (error) {
        console.error(error);
        await context.reply("An error occurred while processing your request.");
    }
});
cmd({
    pattern: "wasted",
    desc: "Applies a 'Wasted' GTA-style effect to an image",
    category: "editor",
    react: "🎮"
}, async (context, match, options) => {
    try {
        if (!context.quoted) {
            return await context.reply("Please reply to an image to apply this effect.");
        }

        let downloadedMedia = await context.client.downloadMediaMessage(context.quoted);
        let imageUrl = await TelegraPh(downloadedMedia);
        let buffer = await getBuffer(`https://some-random-api.ml/canvas/wasted?avatar=${imageUrl}`);

        await context.reply(buffer, { caption: "Effect applied successfully.", quoted: context }, 'image');
    } catch (error) {
        console.error(error);
        await context.reply("An error occurred while processing your request.");
    }
});