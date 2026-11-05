const express = require('express');
const path = require('path');
const { createServer } = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = createServer(app);

// Serve static files from the project root
app.use(express.static(path.join(__dirname, 'dist')));

// For all other routes, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 8082;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});