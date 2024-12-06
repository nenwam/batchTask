const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Import fetch using dynamic import since node-fetch v3 is ESM only
let fetch;
(async () => {
  const nodeFetch = await import('node-fetch');
  fetch = nodeFetch.default;
})();

app.use(cors());
app.use(express.json());

app.post('/oauth/token', async (req, res) => {
  const { client_id, client_secret, code, redirect_uri } = req.body;
  console.log("Request Body:", req.body);
  try {
    if (!fetch) {
      throw new Error('Fetch not initialized');
    }

    const response = await fetch('https://auth.monday.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
        redirect_uri
      })
    });

    console.log("Response:", response);

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).json({ error: 'Failed to exchange code for token' });
  }
});


app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});