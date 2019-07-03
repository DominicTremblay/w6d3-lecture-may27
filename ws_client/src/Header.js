import React from 'react';
import './Header.css';
import UserForm from './UserForm';

// When we don't need a state in the current component, we can create a
// functional stateless component
// Simpler to user.

// destructuring the content of the props in the parameter
const Header = ({ username, online, color, updateUsername }) => {
  // equivalent to:
  // const {username, online, color} = props;

  return (
    <header>
      <nav>
        <div className="intro">
          <h1>Awesome Chat</h1>
          <UserForm updateUsername={updateUsername} />
        </div>
        <div>
          <div className="user-info">
            <h4 style={{ color }}>Username: {username}</h4>
            <h4>Status: {online ? 'Online' : 'Offline'}</h4>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
