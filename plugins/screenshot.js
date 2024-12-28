






















const { tlang, cmd } = require('../lib'); // Import necessary libraries
const axios = require('axios'); // Used for making HTTP requests

cmd({
  pattern: 'ss',
  desc: 'Capture the content of a URL based on the chosen format',
  category: 'utility',
  react: '📸'
}, async (message, match) => {
  try {
    // Check if the user provided a URL
    if (!match) {
      return await message.reply('❌ Please provide a valid URL to capture.');
    }

    // Ask the user to choose a format
    const formatOptions = `Please choose a format for the screenshot:\n\n1️⃣ DESKTOP\n2️⃣ TABLET\n3️⃣ MOBILE\n\nSimply send the corresponding number.`;
    await message.reply(formatOptions);

    // Wait for the user's response
    let response = await message.getReply();
    const choice = parseInt(response.text.trim());

    // Define the format based on the user's choice
    let format;
    switch (choice) {
      case 1:
        format = 'desktop';
        break;
      case 2:
        format = 'tablet';
        break;
      case 3:
        format = 'mobile';
        break;
      default:
        return await message.reply('❌ Invalid choice. Please retry by selecting 1, 2, or 3.');
    }

    // Generate the API URL for thum.io
    const apiURL = `https://image.thum.io/get/${format}/${match}`;

    // Download the screenshot
    const screenshot = await axios.get(apiURL, { responseType: 'arraybuffer' });

    // Send the screenshot to the user
    await message.replyWithImage(
      { buffer: Buffer.from(screenshot.data), filename: `screenshot-${format}.png` },
      { caption: `✅ Screenshot captured successfully in **${format.toUpperCase()}** format!` }
    );

  } catch (error) {
    console.error(error);
    await message.reply('❌ An error occurred while capturing the screenshot. Please check the URL and try again.');
  }
});