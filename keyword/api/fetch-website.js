const https = require('https');
const http = require('http');

// Use built-in fetch (available in Node.js 18+)
const fetch = globalThis.fetch || (async () => { throw new Error('fetch not available'); })();

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

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      signal: controller.signal,
      timeout: 15000
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

    res.status(200).json({
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
}
