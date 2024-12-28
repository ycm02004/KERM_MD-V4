























const { cmd } = require('../command'); // Ensure cmd is correctly defined in your project
const fetch = require('node-fetch'); // Don't forget to install 'node-fetch' if it's not already installed
const { getBuffer } = require('../lib/functions'); // Ensure this function is present to fetch the image buffer

cmd({
    pattern: 'hd', // Command name
    desc: 'Enhance the resolution of an image sent',
    category: 'image',
    use: '.hd', // Usage of the command (after sending the image)
    react: '🌟', // Reaction to the command
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
        // Check if the user has sent an image in the message (either as an image or as a quote)
        let imageUrl;

        // If the image is quoted in the message
        if (quoted && quoted.message && quoted.message.imageMessage) {
            imageUrl = quoted.message.imageMessage.url;
        } 
        // If the image is sent directly
        else if (mek.message && mek.message.imageMessage) {
            imageUrl = mek.message.imageMessage.url;
        } 
        else {
            return reply('❌ Please send an image to process in HD.');
        }

        // Fetch the image buffer
        const imageBuffer = await getBuffer(imageUrl);

        // Set the API key
        const apiKey = 'api-key:3bf78262-644c-4062-ab47-4177acf62d46'; // Your API key
        const apiUrl = 'https://api.deepai.org/api/torch-srgan'; // The API URL to enhance image resolution

        // Make a POST request to the API to enhance the image
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Api-Key': apiKey // Include the API key in the headers
            },
            body: JSON.stringify({
                image: imageUrl // Image URL to enhance
            }),
        });

        // Process the API response
        const data = await response.json();

        // If the API returns an enhanced image URL
        if (data && data.output_url) {
            // Send the enhanced HD image with a caption
            await conn.sendMessage(from, {
                image: { url: data.output_url },
                caption: `Here ${sender} this is your HD image.` // Caption displayed to the user
            }, { quoted: mek });
        } else {
            // If the image could not be enhanced, send an error message
            reply('❌ Unable to enhance the image. Please try again later.');
        }
    } catch (error) {
        // Handle any errors that occur
        console.error(error);
        reply('❌ An error occurred while processing your request.');
    }
});