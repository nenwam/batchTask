const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3001;

app.use(express.json());

app.post('/oauth/token', async (req, res) => {
  try {
    const response = await fetch('https://auth.monday.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching token' });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});