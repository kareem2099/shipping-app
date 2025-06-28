const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (like index.html)
app.use(express.static(path.join(__dirname)));

// Import the calcShipping handler
const calcShippingHandler = require('./api/calcShipping');

// API endpoint for calcShipping
app.post('/api/calcShipping', async (req, res) => {
  // Mimic the Vercel serverless function environment for req and res
  // The calcShippingHandler expects req and res objects similar to Node.js http module
  // and uses res.setHeader, res.status, res.json, res.end
  await calcShippingHandler(req, res);
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    // This is a JSON parsing error from body-parser
    console.error('Bad JSON:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  // General error handler
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Open http://localhost:${port}/index.html in your browser to test.`);
});
