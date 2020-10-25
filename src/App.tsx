import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import './App.css';
import LoginButton from './components/LoginButton';
import Profile from './components/Profile';
import useWsClient from './client/useWsClient';
import ErrorMessage from './components/ErrorMessage';

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return <ErrorMessage 
    name="App"
    error={error}
    resetErrorBoundary={resetErrorBoundary}
  />
}

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const client = useWsClient({
    uri: process.env.REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT
  })

  if (isLoading) {
    return <div>Loading ...</div>;
  } else if (isAuthenticated && user && client) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ApolloProvider client={client}>
          <div className="App">
            <header className="App-header">
              <Profile user={user} />
            </header>
          </div>
        </ApolloProvider>
      </ErrorBoundary>
    );
  } else {
    return <LoginButton />;
  }
};
