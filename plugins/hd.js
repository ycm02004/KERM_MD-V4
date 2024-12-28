

















const { cmd } = require('../command'); // Ensure cmd is defined in your project
const fetch = require('node-fetch'); // Make sure you have 'node-fetch' installed
const { getBuffer } = require('../lib/functions'); // Helper function to get the image buffer

cmd({
    pattern: 'hd', // Command pattern
    desc: 'Enhance the resolution of an image to HD',
    category: 'image',
    use: '.hd <image_url>', // Usage instruction
    react: '🌟', // Reaction to be added after the command
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
    try {
        // Ensure an image URL is provided
        if (!args.length) {
            return reply('❌ Please provide a valid image URL.');
        }

        const imageUrl = args[0];

        // Fetch the image buffer
        const imageBuffer = await getBuffer(imageUrl);

        // Make a request to the DeepAI API to upscale the image to HD
        const apiKey = 'api-key:3bf78262-644c-4062-ab47-4177acf62d46'; // Your provided API key
        const apiUrl = 'https://api.deepai.org/api/torch-srgan';

        // Send the image to DeepAI API to enhance the resolution
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Api-Key': apiKey
            },
            body: JSON.stringify({
                image: imageUrl
            }),
        });

        // Check if the response is successful
        const data = await response.json();

        if (data && data.output_url) {
            // Image has been enhanced
            await conn.sendMessage(from, {
                image: { url: data.output_url },
                caption: `Here ${sender} this is your HD image.`
            }, { quoted: mek });
        } else {
            reply('❌ Unable to enhance the image. Please try again later.');
        }
    } catch (error) {
        console.error(error);
        reply('❌ An error occurred while processing your request.');
    }
});