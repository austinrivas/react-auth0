import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import ErrorMessage from './components/ErrorMessage';
import { InMemoryCache } from '@apollo/client';
import { CachePersistor } from 'apollo3-cache-persist'

const {
  REACT_APP_AUTH0_CLIENT_ID,
  REACT_APP_AUTH0_DOMAIN,
  REACT_APP_AUTH0_AUDIENCE,
  REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT
} = process.env;

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return <ErrorMessage 
    name="Root"
    error={error}
    resetErrorBoundary={resetErrorBoundary}
  />
}

/* Set up local cache */
const cache = new InMemoryCache();

/* Create persistor to handle persisting data from local storage on refresh, etc */
const persistor = new CachePersistor({ cache, storage: window.localStorage });

function renderApp(appCache: InMemoryCache) {
  let root;

  if (
    REACT_APP_AUTH0_CLIENT_ID && 
    REACT_APP_AUTH0_DOMAIN && 
    REACT_APP_AUTH0_AUDIENCE &&
    REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT
    ) {
      root = (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Auth0Provider
            domain={REACT_APP_AUTH0_DOMAIN}
            clientId={REACT_APP_AUTH0_CLIENT_ID}
            redirectUri={window.location.origin}
            audience={REACT_APP_AUTH0_AUDIENCE}
          >
            <App cache={appCache}/>
          </Auth0Provider>
        </ErrorBoundary>
      )
    } else {
      root = (<div>Environment Error!</div>)
    }

    ReactDOM.render(
      root,
      document.getElementById("root")
    );
};

/* Render React App after hydrating from local storage */
persistor.restore().then(() => {
  renderApp(cache);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
