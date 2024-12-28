const { cmd } = require('../command'); // Ensure cmd is properly defined in your project

cmd({
    pattern: "spotify", // Command name
    desc: "Download Spotify music by providing a link.",
    category: "downloader",
    use: ".spotify <Spotify URL>",
    react: "🎵", // Added reaction
    filename: __filename
},
async (conn, mek, m, { from, quoted, args, reply }) => {
    try {
        // Check if the user provided a URL
        if (!args[0]) {
            return reply("❌ Please provide a valid Spotify link!");
        }

        // Define the API URL with the user-provided Spotify URL
        const spotifyUrl = args[0];
        const apiUrl = `https://pikabotzapi.vercel.app/downloader/spotifydl/?apikey=anya-md&url=${spotifyUrl}`;

        // Fetch data from the API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Check if the API returned valid data
        if (data && data.status === true) {
            const {
                title,            // Song title
                thumbnail,        // URL of the cover image
                artist,           // Artist name
                duration,         // Duration of the song
                release_date,     // Release date
                album,            // Album name
                genre,            // Genre (type) of music
                audio_url         // URL of the audio file
            } = data.result;

            // Send the music details along with the cover image
            await conn.sendMessage(from, {
                image: { url: thumbnail },
                caption: `🎵 *Spotify Music Details* 🎵\n\n` +
                         `📌 *Title* : ${title}\n` +
                         `🎤 *Artist* : ${artist}\n` +
                         `⏳ *Duration* : ${duration}\n` +
                         `📅 *Release Date* : ${release_date}\n` +
                         `💿 *Album* : ${album}\n` +
                         `🎶 *Genre* : ${genre}\n\n` +
                         `🎧 Downloading...`
            }, { quoted: mek });

            // Send the audio file
            await conn.sendMessage(from, {
                audio: { url: audio_url },
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`
            }, { quoted: mek });

        } else {
            // Handle errors if the API fails to return valid data
            reply("❌ Unable to fetch the details. Please check the Spotify link.");
        }
    } catch (e) {
        // Catch and log any errors during the execution
        console.error(e);
        await reply('❌ An error occurred while processing your request.');
    }
});