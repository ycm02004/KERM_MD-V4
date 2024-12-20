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
});