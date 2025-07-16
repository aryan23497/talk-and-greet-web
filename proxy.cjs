const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 5001; // Proxy port

const API_TOKEN = '7d7886e815e945cdf7fafdb557eaf347cbe12dca';
const API_BASE = 'https://api.indiankanoon.org';

app.use(express.json());

app.use('/ik', async (req, res) => {
  const apiUrl = API_BASE + req.url.replace(/^\/ik/, '');
  console.log(`[Proxy] ${req.method} ${apiUrl}`);
  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Authorization': `Token ${API_TOKEN}`,
        'Accept': 'application/json',
      },
    });
    const data = await response.text();
    console.log(`[Proxy] Response status: ${response.status}`);
    res.status(response.status).send(data);
  } catch (err) {
    console.error('[Proxy] Error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 