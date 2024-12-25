





































const acrcloud = require("acrcloud"); // Assurez-vous que ce module est installé
const fs = require("fs");
const path = require("path");
const os = require("os");
const { cmd } = require("../command");

// Configure ACRCloud
const acr = new acrcloud({
    host: "identify-ap-southeast-1.acrcloud.com",
    access_key: "26afd4eec96b0f5e5ab16a7e6e05ab37",
    access_secret: "wXOZIqdMNZmaHJP1YDWVyeQLg579uK2CfY6hWMN8",
});

// Command: .shazam
cmd({
    pattern: "shazam",
    alias: ["find", "identify"],
    react: "🔎",
    desc: "Identify a song by its audio.",
    category: "music",
    react: "🎶",
    filename: __filename,
}, async (conn, mek, m, { reply, quoted }) => {
    try {
        // Vérifiez si un fichier audio est attaché ou cité
        let targetMessage = m.quoted ? m.quoted : m;
        let mimeType = targetMessage.mimetype || "";

        if (!mimeType.startsWith("audio") && !mimeType.startsWith("video")) {
            throw "Please reply to an audio file or video clip.";
        }

        // Téléchargez l'audio
        let audioData = await targetMessage.download();
        let tempPath = path.join(os.tmpdir(), "TempAudio.mp3");
        fs.writeFileSync(tempPath, audioData);

        // Analyser l'audio avec ACRCloud
        const audioBuffer = fs.readFileSync(tempPath);
        const result = await acr.identify(audioBuffer);

        // Supprimez le fichier temporaire
        fs.unlinkSync(tempPath);

        // Vérifiez et formatez les résultats
        if (result.status.code !== 0 || !result.metadata) {
            throw "Unable to identify the song. Please try again with a clearer audio sample.";
        }

        const music = result.metadata.music[0];
        const title = music.title || "Unknown";
        const artist = music.artists.map(a => a.name).join(", ") || "Unknown";
        const album = music.album ? music.album.name : "Unknown";

        // Envoyez le résultat
        reply(
            `🎵 *Song Identified!* 🎵\n\n` +
            `> 🩷*Title:* ${title}\n` +
            `> 🍓*Artist(s):* ${artist}\n` +
            `> ⚔️*Album:* ${album}\n\n` +
            `> *© Identified using Kerm ACRCloud*`
        );
    } catch (error) {
        console.error(error);
        reply(`Error identifying the song: ${error}`);
    }
});