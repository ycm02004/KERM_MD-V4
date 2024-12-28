

























const axios = require('axios'); // Import Axios for HTTP requests

module.exports = {
  name: 'ss', // Command name
  description: 'Capture the content of a URL based on the chosen format',
  execute: async (message, args) => {
    try {
      // Ensure a URL is provided
      if (!args.length) {
        return message.reply('❌ Please provide a valid URL to capture.');
      }
      const url = args[0];

      // Ask the user to choose a format
      const formatOptions = `Please choose a format for the screenshot:\n\n1️⃣ DESKTOP\n2️⃣ TABLET\n3️⃣ MOBILE\n\nSimply send the corresponding number.`;
      await message.reply(formatOptions);

      // Wait for the user's response
      let response = await message.getReply();
      const choice = parseInt(response.text.trim());

      // Define the format
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
          return message.reply('❌ Invalid choice. Please retry by selecting 1, 2, or 3.');
      }

      // Construct the screenshot URL
      const apiURL = `https://image.thum.io/get/${format}/${url}`;

      // Fetch the screenshot
      const screenshot = await axios.get(apiURL, { responseType: 'arraybuffer' });

      // Send the screenshot
      await message.replyWithImage(
        { buffer: Buffer.from(screenshot.data), filename: `screenshot-${format}.png` },
        { caption: `✅ Screenshot captured successfully in **${format.toUpperCase()}** format!` }
      );
    } catch (error) {
      console.error(error);
      message.reply('❌ An error occurred while capturing the screenshot. Please check the URL and try again.');
    }
  },
};