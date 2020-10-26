import React from 'react'
import { useAuth0 } from "@auth0/auth0-react"
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import './App.css';
import LoginButton from './components/LoginButton'
import LogoutButton from './components/LogoutButton'
import Profile from './components/Profile'
import ErrorMessage from './components/ErrorMessage'
import { InMemoryCache } from '@apollo/client';
import AuthorizedApolloProvider from './client/AuthorizedApolloProvider'

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return <ErrorMessage 
    name="App"
    error={error}
    resetErrorBoundary={resetErrorBoundary}
  />
}

export default function App({ cache }: { cache: InMemoryCache }) {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading App...</div>;
  } else if (isAuthenticated && user) {
    console.log(user);
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AuthorizedApolloProvider cache={cache}>
          <div className="App">
            <header className="App-header">
              <Profile user={user} />
              <LogoutButton />
            </header>
          </div>
        </AuthorizedApolloProvider>
      </ErrorBoundary>
    );
  } else {
    return <LoginButton />;
  }
};
