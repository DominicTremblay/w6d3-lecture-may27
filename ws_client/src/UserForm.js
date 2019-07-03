import React, { Component } from 'react';

class UserForm extends Component {
  constructor(props) {
    super(props);

    // creating a local state for a controlled input box
    this.state = {
      username: '',
    };
  }

  // This is the handler for a controlled component
  handleChange = event => {
    this.setState({ username: event.target.value });
  };

  handleSubmit = event => {
    // if it's the Enter key, send the username to app
    if (event.key === 'Enter') {
      // calling updateUsername in app
      this.props.updateUsername(this.state.username);
      // resetting the local state
      this.setState({ username: '' });
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={this.state.username}
          onChange={this.handleChange}
          onKeyUp={this.handleSubmit}
        />
      </div>
    );
  }
}

export default UserForm;
