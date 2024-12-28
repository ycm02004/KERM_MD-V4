const { cmd } = require('../command'); // Assurez-vous que cmd est bien défini dans votre projet
const axios = require('axios');

cmd({
    pattern: "nsfw", // Nom de la commande
    desc: "Display a list of NSFW options",
    category: "fun",
    use: '.nsfw',
    react: "🔥", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Liste des options NSFW
        const nsfwList = `
Here is your NSFW command, choose one:

🤤 *EJACULATION*
🍆 *PENIS*
🔞 *EREC*
🍇 *FEMALE*
💋 *EMBRASSE*
🤺 *SOUL*
🩰 *VIRGIN*
🤤 *PUSSY*
🍆 *PENETRATION*
🐾 *ANIMAL*
⚡️ *PIKACHU*
🍒 *TESTICULE*
🔥 *5GIRLS*
🔥 *EXCITED*
🫃🏽 *TWERK*
💣 *RESIDENT_EVIL*
🥷🏽 *NARUTO*
🍑 *ASS*


Simply type the number corresponding to the option you'd like to choose.`;

        // Envoyer le message avec l'image et le texte
        await conn.sendMessage(from, { 
            text: nsfwList, 
            caption: 'Choose one from the list above!', 
            image: { url: 'https://files.catbox.moe/oux9nw.jpeg' }
        }, { quoted: mek });
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "ejaculation", // Nom de la commande
    desc: "Fetch a NSFW image related to the command",
    category: "fun",
    use: '.ejaculation',
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiURL = `https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=ejaculation`;
        
        // Récupérer l'image via l'API
        const response = await axios.get(apiURL);

        if (response.data && response.data.image_url) {
            const imageUrl = response.data.image_url;

            // Envoi de l'image avec le caption
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `Here your ${command} image 🔞🍆🍑.\n> KERM🍑🔞.`,
            }, { quoted: mek });
        } else {
            await reply('❌ No image found for this category.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while fetching the image.');
    }
});
cmd({
    pattern: "penis", // Nom de la commande
    desc: "Fetch a NSFW image related to the command",
    category: "fun",
    use: '.penis',
    react: "🍑",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiURL = `https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=penis_under_skirt`;
        
        // Récupérer l'image via l'API
        const response = await axios.get(apiURL);

        if (response.data && response.data.image_url) {
            const imageUrl = response.data.image_url;

            // Envoi de l'image avec le caption
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `Here your ${command} image 🔞🍆🍑.\n> KERM🍑🔞.`,
            }, { quoted: mek });
        } else {
            await reply('❌ No image found for this category.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while fetching the image.');
    }
});
cmd({
    pattern: "erec", // Nom de la commande
    desc: "Fetch a NSFW image related to the command",
    category: "fun",
    use: '.erec',
    react: "🍑",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiURL = `https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=erect_nipple`;
        
        // Récupérer l'image via l'API
        const response = await axios.get(apiURL);

        if (response.data && response.data.image_url) {
            const imageUrl = response.data.image_url;

            // Envoi de l'image avec le caption
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: `Here your ${command} image 🔞🍆🍑.\n> KERM🍑🔞.`,
            }, { quoted: mek });
        } else {
            await reply('❌ No image found for this category.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while fetching the image.');
    }
});
cmd({
    pattern: "female", // Nom de la commande
    desc: "Display a female protagonist NSFW image",
    category: "fun",
    use: '.female',
    react: "🍑", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=female_protagonist';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande female
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your female protagonist image 🔞🍑.\n> KERM🍑🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "embrasse", // Nom de la commande
    desc: "Display an embrace NSFW image",
    category: "fun",
    use: '.embrasse',
    react: "💋", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=embrace';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande embrasse
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your embrasse image 🔞💋.\n> KERM💋🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "soul", // Nom de la commande
    desc: "Display a Soul Calibur NSFW image",
    category: "fun",
    use: '.soul',
    react: "🔥", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=soul_calibur';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande soul
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Soul Calibur image 🔞🔥.\n> KERM🔥🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "virgin", // Nom de la commande
    desc: "Display a Virgin NSFW image",
    category: "fun",
    use: '.virgin',
    react: "💋", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=virgin';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande virgin
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Virgin NSFW image 🔞🔥.\n> KERM💋🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "pussy", // Nom de la commande
    desc: "Display a NSFW image of category 'puffy pussy'",
    category: "fun",
    use: '.pussy',
    react: "🍑", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=puffy_pussy';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande pussy
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Pussy NSFW image 🔞🍑🔥.\n> KERM💋🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "penetration", // Nom de la commande
    desc: "Display a NSFW image of category 'human_penetrating_anthro'",
    category: "fun",
    use: '.penetration',
    react: "🔥", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=human_penetrating_anthro';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande penetration
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Penetration NSFW image 🔞🍑🔥.\n> KERM💋🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "animal", // Nom de la commande
    desc: "Display a NSFW image of category 'animal'",
    category: "fun",
    use: '.animal',
    react: "🐾", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=animal';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande animal
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Animal NSFW image 🔞🐾🔥.\n> KERM🐾🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "pikachu", // Nom de la commande
    desc: "Display a NSFW image of Pikachu",
    category: "fun",
    use: '.pikachu',
    react: "⚡", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Utiliser l'API pour récupérer l'image
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=pikachu';
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifier si l'image est disponible
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoyer l'image de la commande Pikachu
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Pikachu NSFW image 🔞⚡🐾.\n> KERM⚡🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "testicule", // Nom de la commande
    desc: "Display a NSFW image related to big testicles",
    category: "fun",
    use: '.testicule',
    react: "🍒", // Réaction à ajouter
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=big_testicles';

        // Faire une requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification des données reçues
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoi de l'image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Testicule NSFW image 🔞🍒.\n> KERM🍒🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "5girls", // Nom de la commande
    desc: "Display a NSFW image featuring 5 girls",
    category: "fun",
    use: '.5girls',
    react: "🔥", // Réaction ajoutée
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=5girls';

        // Faire une requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification des données reçues
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoi de l'image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your 5 Girls NSFW image 🔞🔥.\n> KERM🔥🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "excited", // Nom de la commande
    desc: "Display a NSFW excited image",
    category: "fun",
    use: '.excited',
    react: "🔥", // Réaction ajoutée
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=excited';

        // Faire une requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification des données reçues
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoi de l'image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Excited NSFW image 🔞🔥.\n> KERM🔥🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "twerk", // Nom de la commande
    desc: "Display a NSFW twerking image",
    category: "fun",
    use: '.twerk',
    react: "🔥", // Réaction ajoutée
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=twerking';

        // Faire une requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification des données reçues
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoi de l'image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Twerk NSFW image 🔞🔥.\n> KERM🔥🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "resident_evil", // Nom de la commande
    desc: "Display a NSFW Resident Evil image",
    category: "fun",
    use: '.resident_evil',
    react: "🔥", // Réaction ajoutée
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=resident_evil_2';

        // Faire une requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification des données reçues
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoi de l'image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Resident Evil NSFW image 🔞🔥.\n> KERM🔥🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "naruto", // Nom de la commande
    desc: "Display a NSFW Naruto image",
    category: "fun",
    use: '.naruto',
    react: "🔥", // Réaction ajoutée
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=naruto_(series)';

        // Faire une requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification des données reçues
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoi de l'image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Naruto NSFW image 🔞🔥.\n> KERM🔥🔞.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});
cmd({
    pattern: "ass", // Nom de la commande
    desc: "Display a NSFW Ass Shake image",
    category: "fun",
    use: '.ass',
    react: "🔥", // Réaction ajoutée
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // URL de l'API
        const apiUrl = 'https://pikabotzapi.vercel.app/anime-nsfw/hentai-images/?apikey=anya-md&category=ass_shake';

        // Faire une requête à l'API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérification des données reçues
        if (data && data.image) {
            const imageUrl = data.image;

            // Envoi de l'image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: 'Here is your Ass Shake NSFW image 🔞🍑.\n> KERM🍑🔥.'
            }, { quoted: mek });
        } else {
            reply('❌ Unable to fetch image. Please try again later.');
        }
    } catch (e) {
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});