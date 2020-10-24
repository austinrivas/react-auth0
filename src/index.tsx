import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";

console.log('process.env', process.env);

const {
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_AUDIENCE
} = process.env;

if (
  REACT_APP_AUTH0_CLIENT_ID && 
  REACT_APP_AUTH0_DOMAIN && 
  REACT_APP_AUTH0_AUDIENCE
  ) {
  ReactDOM.render(
    <Auth0Provider
      domain={REACT_APP_AUTH0_DOMAIN}
      clientId={REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={REACT_APP_AUTH0_AUDIENCE}
    >
      <App />
    </Auth0Provider>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(
    <div>Environment Error!</div>,
    document.getElementById("root")
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
