import React, { Component } from 'react';
import './App.css';
import Header from './Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {
        id: null,
        username: 'Anonymous',
        color: 'black',
        online: false,
      },
    };

    // Creating the connection to the Socket Server
    this.SocketServer = new WebSocket('ws://localhost:3001');
  }

  // Will send a notification to the socket server
  sendNotification = msg => {
    const message = {
      message: msg,
      type: 'postNotification',
    };

    this.SocketServer.send(JSON.stringify(message));
  };

  // Create the notification for a change of name and call sendNotification
  // Update the username in the state
  updateUsername = newUsername => {
    const notificationMsg = `${
      this.state.currentUser.username
    } has changed their name to ${newUsername}`;

    this.sendNotification(notificationMsg);

    // update the username in currentUser
    this.setState({
      currentUser: {
        //  spreading the currentUser object, basically copying all the keys and values into a new object
        ...this.state.currentUser,
        // Just overwriting the key, value that we need to change
        username: newUsername,
      },
    });
  };

  // changing the online status in the state
  updateStatus = status => {
    this.setState({
      currentUser: {
        // spreading currentUser object properties
        ...this.state.currentUser,
        // overwriting the online key value
        online: status,
      },
    });
  };

  // on open event handler when the client connects to socket server
  handleOnOpen = event => {
    console.log('Connection to server established.');
    // changing from offline to online
    this.updateStatus(true);
  };

  // Updating the state with the client info received
  updateClientInfo = ({ id, username, color }) => {
    this.setState({
      currentUser: {
        ...this.state.currentUser,
        id,
        username,
        color,
      },
    });
  };

  // on message event handler triggered everytime the server is sending a message
  // In other words, catching messages from the server
  handleOnMessage = event => {
    // We need to parse the incoming message
    const incomingMessage = JSON.parse(event.data);

    // We take different actions based on the type
    switch (incomingMessage.type) {
      case 'incomingClientInfo':
        this.updateClientInfo(incomingMessage);
        break;
      case 'incomingNotification':
        console.log(incomingMessage);
        // this is where you would call an updateMessages fonction to update the
        // messages is your state
        break;

      default:
        console.log('Unkown type of message');
    }
  };

  //
  componentDidMount() {
    this.SocketServer.onopen = this.handleOnOpen;
    this.SocketServer.onmessage = this.handleOnMessage;
  }

  render() {
    return (
      <Header
        username={this.state.currentUser.username}
        color={this.state.currentUser.color}
        online={this.state.currentUser.online}
        updateUsername={this.updateUsername}
      />
    );
  }
}

export default App;
