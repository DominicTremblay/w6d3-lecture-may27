const express = require('express');
const uuidv4 = require('uuid/v4');
const SocketServer = require('ws');

const PORT = process.env.PORT || 3001;
const app = express();

const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

// Creating the socket server
const wss = new SocketServer.Server({ server });

// Generates a random color using UUID
const getColor = () => {
  const hexCode = uuidv4().slice(0, 6);
  return `#${hexCode}`;
};

// build a message to send a user id, username and color to the currently connecting client
const connectClient = (client, nbClients) => {
  const userId = uuidv4();

  const message = {
    id: userId,
    username: `Anonymous${nbClients}`,
    color: getColor(),
    type: 'incomingClientInfo',
  };

  // The message object always need to be stringified
  client.send(JSON.stringify(message));
};

// Broadcast the notification message to all currently connected client
// We assigned a message id and changed the type to incomingNotification

const sendNotification = ({ message }) => {
  const outgoingMsg = {
    id: uuidv4(),
    message,
    type: 'incomingNotification',
  };

  // calling our broadcast function
  wss.broadcast(JSON.stringify(outgoingMsg));
};

// add a broadcast function to wss object
wss.broadcast = message => {
  // Loops over the collection of clients and send a message to each one
  wss.clients.forEach(client => {
    // Disable the if statement if it's causing you problems
    if (client.readyState === SocketServer.OPEN) {
      client.send(message);
    }
  });
};

// on connection event that gets triggered when a new client connects to the socket server
wss.on('connection', wsClient => {
  console.log('Client connected');
  // send back client info to current client
  connectClient(wsClient, wss.clients.size);

  // on message is catching any message sent by the client
  wsClient.on('message', message => {
    // we need to parse the incoming message
    const postMessage = JSON.parse(message);

    // We're going to take different actions based on the type of message
    switch (postMessage.type) {
    case 'postNotification':
      sendNotification(postMessage);
      break;

    default:
      console.log('Unkown Type of Message');
    }
  });

  // triggered when the connection is closed
  wsClient.on('close', () => {
    console.log('Client disconnected');
  });
});
