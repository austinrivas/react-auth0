import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './ErrorFallback'

const {
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_AUDIENCE,
  REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT
} = process.env;

if (
  REACT_APP_AUTH0_CLIENT_ID && 
  REACT_APP_AUTH0_DOMAIN && 
  REACT_APP_AUTH0_AUDIENCE &&
  REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT
  ) {
 
  ReactDOM.render(
    <ErrorBoundary fallback={<div>Error!</div>}>
      <Auth0Provider
        domain={REACT_APP_AUTH0_DOMAIN}
        clientId={REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={window.location.origin}
        audience={REACT_APP_AUTH0_AUDIENCE}
      >
        <App />
      </Auth0Provider>
    </ErrorBoundary>,
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
