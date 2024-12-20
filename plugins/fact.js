/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/




const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "fact",
    desc: "🧠 Get a random fun fact",
    react: "😝",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const url = 'https://uselessfacts.jsph.pl/random.json?language=en';  // API for random facts
        const response = await axios.get(url);
        const fact = response.data.text;

        const funFact = `
🤣 *KERM_MD-V4 RANDOM FACT* 🤣

${fact}

Isn't that interesting ? 😄
`;

        return reply(funFact);
    } catch (e) {
        console.log(e);
        return reply("⚠️ An error occurred while fetching a fun fact. Please try again later🤕.");
    }
});

cmd({
    pattern: "joke",
    desc: "😂 Get a random joke",
    react: "🤣",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const url = 'https://official-joke-api.appspot.com/random_joke';  // API for random jokes
        const response = await axios.get(url);
        const joke = response.data;
        const jokeMessage = `
*😂Here's a random joke for you😂.*

*${joke.setup}*
${joke.punchline} 😄

> *POWERED BY KG TECH*
`;
        return reply(jokeMessage);
    } catch (e) {
        console.log(e);
        return reply("⚠️ Couldn't fetch a joke right now. Please try again later.");
    }
});
cmd({
    pattern: "minutor",
    desc: "Start a countdown timer for a specified duration.",
    react: "⏳",
    category: "utility",
    use: ".minutor <time><s|m|h>",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Validate input
        if (!args[0]) {
            return reply("❌ Please provide a valid duration.\nExamples: `.minutor 10s`, `.minutor 5m`, `.minutor 1h`");
        }

        // Extract time value and unit
        const input = args[0];
        const timeValue = parseInt(input.slice(0, -1)); // Extract number
        const timeUnit = input.slice(-1).toLowerCase(); // Extract unit (s, m, h)

        if (isNaN(timeValue) || timeValue <= 0 || !["s", "m", "h"].includes(timeUnit)) {
            return reply("❌ Invalid format. Use `<number><s|m|h>`.\nExamples: `.minutor 10s`, `.minutor 5m`, `.minutor 1h`");
        }

        // Convert time to milliseconds
        let duration;
        switch (timeUnit) {
            case "s": // Seconds
                duration = timeValue * 1000;
                break;
            case "m": // Minutes
                duration = timeValue * 60 * 1000;
                break;
            case "h": // Hours
                duration = timeValue * 60 * 60 * 1000;
                break;
            default:
                return reply("❌ Unsupported time unit. Use `s` for seconds, `m` for minutes, or `h` for hours.");
        }

        // Notify user that the countdown has started
        reply(`⏳ Countdown started for ${timeValue}${timeUnit}. I'll notify you when the time is up!`);

        // Wait for the specified duration
        await new Promise(resolve => setTimeout(resolve, duration));

        // Send message after the time is up
        reply(`⏰ Time's up! ${timeValue}${timeUnit} have passed.\n\n> POWERED BY KERM🧞‍♂️.`);
    } catch (error) {
        console.error("Error in minutor command:", error);
        reply("❌ An error occurred while starting the timer. Please try again.");
    }
});
cmd({
    pattern: "lyrics",
    alias: "lyric",
    desc: "Get the lyrics of a song by artist and title.",
    react: "🎵",
    category: "utility",
    use: ".lyrics <artist> <song title>",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length < 2) {
            return reply("❌ Please provide the artist and song title.\nExample: `.lyrics Ed Sheeran Shape of You`");
        }

        // Parse the user input
        const artist = args[0]; // First word is the artist's name
        const title = args.slice(1).join(" "); // The rest is the song title

        if (!artist || !title) {
            return reply("❌ Please specify both the artist and the song title.\nExample: `.lyrics Ed Sheeran Shape of You`");
        }

        // Notify the user that the lyrics are being fetched
        reply(`🎵 Searching for lyrics of "${title}" by ${artist}...`);

        // Fetch lyrics using an API
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${title}`);
        const lyrics = response.data.lyrics;

        if (!lyrics) {
            return reply(`❌ Sorry, no lyrics found for "${title}" by ${artist}.`);
        }

        // Send the lyrics back to the chat
        reply(`*KERM RESULT*\n\n🎶 *${title}* by *${artist}*\n\n${lyrics}`);
    } catch (error) {
        console.error("Error fetching lyrics:", error.message);

        if (error.response && error.response.status === 404) {
            reply("❌ Sorry, no lyrics found for the specified artist and song title.");
        } else {
            reply("❌ An error occurred while fetching the lyrics. Please try again later.");
        }
    }
});
// Variable pour suivre l'état du chatbot (activé/désactivé)
let chatbotEnabled = false;

// Activer ou désactiver le chatbot
cmd({
    pattern: "chatbot",
    desc: "Activate or deactivate the chatbot.",
    react: "🤖",
    category: "chat",
    use: ".chatbot on/off",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Si aucun argument n'est donné
        if (args.length === 0) {
            return reply("❌ Please provide a command. Use '.chatbot on' to activate or '.chatbot off' to deactivate.");
        }

        // Activer le chatbot
        if (args[0].toLowerCase() === "on") {
            chatbotEnabled = true;
            return reply("✅ Chatbot Kerm has been activated. You can now chat with the bot.");
        }

        // Désactiver le chatbot
        if (args[0].toLowerCase() === "off") {
            chatbotEnabled = false;
            return reply("❌ Chatbot Kerm has been deactivated. The bot will no longer respond to messages.");
        }

    } catch (error) {
        console.error("Error in chatbot command:", error.message);
        reply("❌ An error occurred. Please try again.");
    }
});

// API OpenAI key for generating responses
const OPENAI_API_KEY = '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'; // Replace with your actual OpenAI API key

// Listen for new messages and respond if chatbot is enabled
conn.on('message-new', async (m) => {
    if (!chatbotEnabled) return; // If chatbot is disabled, ignore messages

    const { text, sender, from } = m;

    // If the message is from a user (not the bot itself)
    if (sender !== conn.user.id) {
        try {
            // Send the message to OpenAI API for generating a response
            const response = await axios.post('https://api.openai.com/v1/completions', {
                model: "text-davinci-003", // or another GPT-3 model available
                prompt: text,
                max_tokens: 150,
                temperature: 0.9, // Adjust creativity of the response
            }, {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            });

            // Get the AI response text
            const botReply = response.data.choices[0].text.trim();

            // Send the AI response back to the chat
            conn.sendMessage(from, { text: botReply });

        } catch (error) {
            console.error("Error in chatbot response:", error.message);
            conn.sendMessage(from, { text: "❌ An error occurred while processing your message. Please try again." });
        }
    }
});