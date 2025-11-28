import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import https from 'https';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());

// Custom HTTPS agent that ignores certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  timeout: 10000
});

const httpAgent = new http.Agent({
  keepAlive: true,
  timeout: 10000
});

// Endpoint to fetch website content
app.post('/api/fetch-website', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Fetching: ${url}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0',
      },
      httpAgent,
      httpsAgent,
      redirect: 'follow',
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Website returned status ${response.status}`,
        status: response.status
      });
    }

    const html = await response.text();

    if (!html || html.length < 100) {
      return res.status(400).json({
        error: 'Unable to fetch valid HTML content from website'
      });
    }

    res.json({
      success: true,
      html,
      url: response.url,
      status: response.status
    });
  } catch (error) {
    console.error('Fetch error:', error.message);

    if (error.name === 'AbortError') {
      return res.status(504).json({
        error: 'Request timeout - website took too long to respond'
      });
    }

    res.status(500).json({
      error: error.message || 'Failed to fetch website',
      details: error.toString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
