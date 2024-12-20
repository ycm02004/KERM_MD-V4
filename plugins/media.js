/*created by Kgtech 🕵
contact dev1 237656520674 ♻️
contact dev2 237650564445 ♻️
© Copy coder alert ⚠
*/




const { cmd } = require('../command');
const axios = require('axios');
const moment = require('moment');

// Variable to keep track of whether the daily fact feature is enabled
let isFactEnabled = false;
let factTimer; // To store the interval timer for daily facts

// Define the themes for each day of the week
const dailyThemes = {
    Monday: 'amour',        // Love
    Tuesday: 'motivation',  // Motivation
    Wednesday: 'science',   // Science
    Thursday: 'blague',     // Joke
    Friday: 'conseils',     // Tips
    Saturday: 'amour',      // Love
    Sunday: 'motivation',   // Motivation
};

cmd({
    pattern: "dailyfact",
    desc: "Get a random fact of the day and control the daily fact feature.",
    react: "📚",
    category: "fun",
    use: ".dailyfact on/off",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    // Check the first argument (on/off)
    if (args[0] === "on") {
        if (isFactEnabled) {
            return reply("❌ The daily fact feature is already enabled.");
        }
        
        isFactEnabled = true;
        reply("✅ The daily fact feature is now enabled. I will send a fact every day at 6 AM (Cameroon time).");

        // Set the daily fact interval at 6 AM (Cameroon time)
        sendDailyFactAt6AM(conn, reply);
    } 
    else if (args[0] === "off") {
        if (!isFactEnabled) {
            return reply("❌ The daily fact feature is already disabled.");
        }

        clearInterval(factTimer); // Clear the timer when the feature is disabled
        isFactEnabled = false;
        reply("❌ The daily fact feature is now disabled.");
    } 
    else {
        reply("❌ Please specify 'on' or 'off' to enable or disable the daily fact feature.\nExample: `.dailyfact on`");
    }
});

// Function to fetch and send the daily fact
async function sendDailyFact(conn, reply) {
    try {
        const dayOfWeek = moment().format('dddd'); // Get the current day of the week
        const theme = dailyThemes[dayOfWeek]; // Get the theme for the current day

        // Send a message saying we're fetching the daily fact
        reply(`Fetching a ${theme} fact for you...`);

        // API endpoint for random facts with the theme based on the current day
        const response = await axios.get(`https://uselessfacts.jsph.pl/random.json?language=fr`);

        // Extract the fact from the API response
        const fact = response.data.text;

        // Send the fact back to the user
        reply(`📚 Here's a ${theme} fact for you on ${dayOfWeek}:\n\n*${fact}\n\n> POWERED BY KERM*`);
        
    } catch (error) {
        console.error("Error fetching daily fact:", error.message);
        reply("❌ Sorry, I couldn't fetch a fact for today. Please try again later.");
    }
}

// Function to calculate the time until 6 AM and set the interval
function sendDailyFactAt6AM(conn, reply) {
    const now = moment();
    const targetTime = moment().set({ hour: 6, minute: 0, second: 0, millisecond: 0 }); // 6 AM Cameroon time

    if (now.isAfter(targetTime)) {
        // If it's already past 6 AM today, set the time for 6 AM tomorrow
        targetTime.add(1, 'days');
    }

    const timeUntilNextRun = targetTime.diff(now); // Time difference in milliseconds

    // Set an interval to send the daily fact at 6 AM every day
    factTimer = setInterval(() => {
        sendDailyFact(conn, reply); // Send the fact at 6 AM every day
    }, 86400000); // Repeat every 24 hours

    // Wait until the next 6 AM and send the first fact
    setTimeout(() => {
        sendDailyFact(conn, reply); // Send the first fact
    }, timeUntilNextRun);
}
cmd({
    pattern: "age",
    desc: "Calculate your age based on your date of birth.",
    react: "🎉",
    category: "utility",
    use: ".age <DD/MM/YYYY>",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        if (args.length === 0) {
            return reply("❌ Please provide your date of birth in the format DD/MM/YYYY.\nExample: `.age 15/08/1995`");
        }

        const birthDate = args[0]; // Get the date of birth from user input
        const dateOfBirth = moment(birthDate, "DD/MM/YYYY");

        // Validate the provided date
        if (!dateOfBirth.isValid()) {
            return reply("❌ Invalid date format. Please use DD/MM/YYYY.\nExample: `.age 15/08/1995`");
        }

        // Calculate the age by comparing the current date with the birthdate
        const age = moment().diff(dateOfBirth, 'years');
        
        // Send the calculated age back to the user
        reply(`🎉 Your age is: *${age}* years old.`);

    } catch (error) {
        console.error("Error calculating age:", error.message);
        reply("❌ An error occurred while calculating your age. Please try again later.");
    }
});
cmd({
    pattern: "tiny",
    desc: "Shorten a URL using TinyURL.",
    react: "🔗",
    category: "utility",
    use: ".tiny <URL>",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        // Check if the user provided a URL
        if (args.length === 0) {
            return reply("❌ Please provide a URL to shorten.\nExample: `.tiny https://example.com`");
        }

        // Get the URL from the user's message
        const url = args.join(" ");

        // Send a request to TinyURL's API to shorten the URL
        const response = await axios.get(`https://api.tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

        // Check if the response is valid and contains a shortened URL
        if (response.data) {
            // Send the shortened URL back to the user
            reply(`🔗 Here is your shortened URL: ${response.data}`);
        } else {
            reply("❌ Something went wrong while shortening the URL. Please try again later.");
        }

    } catch (error) {
        console.error("Error shortening URL:", error.message);
        reply("❌ An error occurred while shortening the URL. Please try again later.");
    }
});
cmd({
    pattern: "define",
    desc: "Get the definition of a word.",
    react: "🔎",
    category: "utility",
    use: ".define <word>",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        // Vérifier si l'utilisateur a donné un mot à définir
        if (args.length === 0) {
            return reply("❌ Please provide a word to define.\nExample: `.define apple`");
        }

        const word = args.join(" ").toLowerCase();

        // Effectuer une requête à l'API pour obtenir la définition du mot
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        // Extraire la définition de la réponse
        const meanings = response.data[0].meanings;
        const definition = meanings ? meanings[0].definitions[0].definition : "No definition found.";

        // Envoyer la définition au chat
        reply(`🔎 Definition of "${word}":\n\n*${definition}*`);

    } catch (error) {
        console.error("Error fetching definition:", error.message);
        reply("❌ Sorry, I couldn't fetch the definition. Please try again later.");
    }
});
cmd({
    pattern: "convert",
    desc: "Convert currencies with symbols.",
    react: "💵",
    category: "utility",
    use: ".convert <amount> <from_currency> to <to_currency>",
    filename: __filename
}, async (conn, mek, m, { reply, args }) => {
    try {
        // Fetch the available currencies from the API
        const response = await axios.get("https://v6.exchangeratesapi.io/latest");
        const availableCurrencies = Object.keys(response.data.rates);

        // Check if the user has provided the right format
        if (args.length < 3) {
            let availableCurrenciesList = availableCurrencies.join(", ");
            return reply(`❌ Usage: \`.convert <amount> <from_currency> to <to_currency>\`\n\nAvailable currencies: ${availableCurrenciesList}`);
        }

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[3].toUpperCase();

        // Check if the amount is a valid number
        if (isNaN(amount)) {
            return reply("❌ Please provide a valid amount to convert.");
        }

        // Check if the fromCurrency and toCurrency are available
        if (!availableCurrencies.includes(fromCurrency) || !availableCurrencies.includes(toCurrency)) {
            return reply(`❌ Invalid currency. Available currencies are: ${availableCurrencies.join(", ")}`);
        }

        // Fetch conversion rates for the selected fromCurrency
        const conversionResponse = await axios.get(`https://v6.exchangeratesapi.io/latest?base=${fromCurrency}`);
        const exchangeRates = conversionResponse.data.rates;

        // Check if the toCurrency is valid
        if (!exchangeRates[toCurrency]) {
            return reply(`❌ Unable to convert to the selected currency. Please check the currency symbol.`);
        }

        // Calculate the converted amount
        const convertedAmount = (amount * exchangeRates[toCurrency]).toFixed(2);

        // Define symbols for some popular currencies (including XAF for FCFA)
        const currencySymbols = {
            USD: "$",
            EUR: "€",
            GBP: "£",
            JPY: "¥",
            AUD: "A$",
            CAD: "C$",
            INR: "₹",
            CHF: "CHF",
            SEK: "kr",
            CNY: "¥",
            XAF: "FCFA"  // Adding XAF (FCFA) symbol
        };

        // Get the symbols for the provided currencies
        const fromSymbol = currencySymbols[fromCurrency] || fromCurrency;
        const toSymbol = currencySymbols[toCurrency] || toCurrency;

        // Send the converted result
        reply(`💰 *${amount} ${fromSymbol}* = *${convertedAmount} ${toSymbol}*`);

    } catch (error) {
        console.error("Error fetching conversion rates:", error.message);
        reply("❌ There was an error with the conversion. Please try again later.");
    }
});
cmd({
    pattern: "timezone",
    desc: "Get the current time in a specific timezone.",
    react: "🕰️",
    category: "utility",
    use: ".timezone <timezone>",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (args.length === 0) {
            return reply("❌ Please provide a timezone. Example: `.timezone Europe/Paris`");
        }

        // Get the timezone input from the user
        const timezone = args.join(" ");

        // API endpoint to get time data
        const response = await axios.get(`http://worldtimeapi.org/api/timezone/${timezone}`);

        // Extract time data
        const timeData = response.data;
        const currentTime = timeData.datetime;
        const timezoneName = timeData.timezone;

        // Format the time and send it back to the user
        reply(`🕰️ The current time in ${timezoneName} is: ${currentTime}`);
        
    } catch (error) {
        console.error("Error fetching time:", error.message);
        reply("❌ Sorry, I couldn't fetch the time for the specified timezone. Please ensure the timezone is valid.");
    }
});
cmd({
    pattern: "vv",
    desc: "Open and resend a 'view once' media in the chat.",
    react: "👀",
    category: "utility",
    use: ".vv (reply to a view-once message)",
    filename: __filename
}, async (conn, mek, m, { quoted, reply }) => {
    try {
        // Check if the command is replied to a view-once message
        if (!quoted || !quoted.message || !quoted.message.viewOnceMessage) {
            return reply("❌ Please reply to a 'view once' message to use this command.");
        }

        // Extract the content of the view-once message
        const mediaMessage = quoted.message.viewOnceMessage.message;

        // Download the media (image or video)
        const mediaData = await conn.downloadMediaMessage(mediaMessage);

        if (!mediaData) {
            return reply("❌ Failed to open the 'view once' message. Please try again.");
        }

        // Determine the type of media (image or video) and resend it
        const isImage = mediaMessage.imageMessage ? true : false;
        const isVideo = mediaMessage.videoMessage ? true : false;

        if (isImage) {
            await conn.sendMessage(m.chat, { image: mediaData, caption: "🔓 Opened 'view once' image" }, { quoted: m });
        } else if (isVideo) {
            await conn.sendMessage(m.chat, { video: mediaData, caption: "🔓 Opened 'view once' video" }, { quoted: m });
        } else {
            reply("❌ Unsupported media type.");
        }
    } catch (error) {
        console.error("Error in 'vv' command:", error);
        reply("❌ An error occurred while opening the 'view once' message. Please try again.");
    }
});
cmd({
    pattern: "shazam",
    alias: "find",
    desc: "Recognize a song from an audio file sent by the user.",
    react: "🎵",
    category: "music",
    filename: __filename,
}, async (conn, mek, m, { from, quoted, isGroup, reply }) => {
    try {
        // Check if the message has an audio file
        if (!quoted || !quoted.audio) {
            return reply("❌ Please send an audio file and reply to it with the command `.shazam`.");
        }

        // Download the audio file from the message
        const audioMessage = await quoted.download();
        const filePath = path.join(__dirname, 'audioFile.mp3');

        // Save the file locally
        fs.writeFileSync(filePath, audioMessage);

        // Send the audio file to the Audd.io API to recognize the song
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('api_token', '088e1380100df1e7832842d31aab7e88');  // Replace with your actual API key

        const response = await axios.post('https://api.audd.io/', formData, {
            headers: formData.getHeaders(),
        });

        // Check if the song was recognized
        if (response.data.status === 'error' || !response.data.result) {
            return reply("❌ Sorry, I couldn't recognize the song.");
        }

        // Extract song details from the response
        const song = response.data.result;
        const songTitle = song.title;
        const songArtist = song.artist;
        const songAlbum = song.album;
        const songLink = song.link;

        // Send the song details back to the user
        reply(`🎶 I Youpiii🥰 recognized the song!\n\n*Title*: ${songTitle}\n*Artist*: ${songArtist}\n*Album*: ${songAlbum}\n*Link*: ${songLink}`);
        
        // Clean up the audio file after recognition
        fs.unlinkSync(filePath);

    } catch (error) {
        console.error("Error recognizing the song:", error);
        reply("❌ An error occurred while trying to recognize the song. Please try again.");
    }
});