const express = require('express');
const uuidv4 = require('uuid/v4');
const SocketServer = require('ws');

const PORT = process.env.PORT || 3001;
const app = express();

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

const wss = new SocketServer.Server({ server });

wss.on('connection', wsClient => {
  console.log('Client connected');

  wsClient.on('close', () => {
    console.log('Client disconnected');
  });
});
