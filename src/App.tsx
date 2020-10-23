import React from 'react';
import './App.css';
import LoginButton from './components/LoginButton';
import Profile from './components/Profile';
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  } else if (isAuthenticated && user) {
    return (
      <div className="App">
        <header className="App-header">
          <Profile user={user} />
        </header>
      </div>
    );
  } else {
    return <LoginButton />;
  }
}

export default App;
