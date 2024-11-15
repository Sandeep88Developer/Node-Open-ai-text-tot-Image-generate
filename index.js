const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 3000;

app.use(express.json());

app.post('/generate-image', async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).send({ error: "Please provide a prompt for image generation." });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/images/generations', 
      {
        prompt: prompt,
        n: 1,
        size: '1024x1024', // Ensure this is a valid size
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        }
      });

    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error Response:', error.response?.data); // Log full error response
    res.status(500).send({ error: 'Error generating image from OpenAI API.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on ${process.env.OPENAI_API_KEY}  http://localhost:${port}`);
});
