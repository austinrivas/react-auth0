import React, { useState } from 'react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  from,
  split
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from "@apollo/client/link/ws"
import { setContext } from '@apollo/client/link/context'
import { useAuth0 } from "@auth0/auth0-react"
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { onError } from "@apollo/client/link/error"
import ErrorMessage from './components/ErrorMessage'
import isServerError from './client/isServerError'
import { BatchHttpLink } from "@apollo/client/link/batch-http"

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return <ErrorMessage 
    name="AuthorizedApolloProvider"
    error={error}
    resetErrorBoundary={resetErrorBoundary}
  />
}

function formatAuthHeader(token: string) {
  return `Bearer ${token}`
}

export default function AuthorizedApolloProvider(
  { cache, children }: 
  { cache: InMemoryCache, children: any }
  ) {
  // used to throw network errors from handlers as react errors
  const [, setState] = useState();
  const { getAccessTokenSilently } = useAuth0();

  const graphQLErrorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
  });

  const networkErrorLink = onError(({ networkError}) => {
    if (networkError) {
      if (isServerError(networkError)) console.log(`[Server error]: ${networkError}`);
      else console.log(`[Network error]: ${networkError}`);
      setState(() => {
        throw networkError;
      });
    }
  });

  const authLink = setContext(async () => {
    const token = await getAccessTokenSilently();
    return { auth0Token: token };
  });

  const headersLink = setContext(async (_, { headers, auth0Token }) => {
    return {
      headers: {
        ...headers,
        Authorization: formatAuthHeader(auth0Token)
      }
    }
  });

  const connectionLink = setContext((_, { connectionParams, auth0Token }) => {
    const headers = connectionParams?.headers ? connectionParams.headers : {};
    return {
      connectionParams: {
        ...connectionParams,
        headers: {
          ...headers,
          Authorization: formatAuthHeader(auth0Token)
        }
      }
    }
  });

  const localToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik4tbm96RlBIdDZKSzl2ZGR2cGpveSJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6InVzZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbInVzZXIiXSwieC1oYXN1cmEtYXV0aDAtaWQiOiJhdXRoMHw1ZjkzNTgyODI5M2JjYzAwNjk2NWQzNGEiLCJ4LWhhc3VyYS11c2VyLWlkIjoiYXVzdGlucml2YXNAZ21haWwuY29tIn0sImlzcyI6Imh0dHBzOi8vYXVzdGlucml2YXMudXMuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVmOTM1ODI4MjkzYmNjMDA2OTY1ZDM0YSIsImF1ZCI6WyJoYXN1cmEiLCJodHRwczovL2F1c3RpbnJpdmFzLnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MDM2NjA5NjMsImV4cCI6MTYwMzc0NzM2MywiYXpwIjoiS1Z4OTJkSEFKcWpha0NxY2s5VHlETHRwOTROeTYwS3ciLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.ps1aSH7qtJsfglUsGs5MqTsSgs1QQh7FLKQ9nMVtL6Fhl7jcssvk7JIgvEv6Tn7oLZFZidH6N6AcAx1dUk3k-crEzyj8-b0UxyOcgw73Zk7WqUds2ztg5uMjF8YmmjHzrzW2Z3iweKBYWyDe8NFArsxbdyif6avQ4Ma2T9yyMqShmKVnbZLXhcVNIRBoS4Cj6H4Wdv6qXrE5VygwCqwDLSrx2FWNF0DydR1EdqJp9I9MJrlUkPBbyc6yybsY5I6WtY0vuhBbLiB1i2arJHl1bXUg3eUP40_yeHK8CoguJoKh55dIVb3HJ8j4Kx4uqlAVZV6D1if5w4aqd9wcygMklQ'

  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT,
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: {
        headers: {
          Authorization: localToken ? formatAuthHeader(localToken) : "",
        }
      }
    }
  });

  const batchLink = new BatchHttpLink({
    uri: process.env.REACT_APP_HASURA_GRAPHQL_HTTPS_ENDPOINT
  });

  // use wsLink if subscription
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    connectionLink.concat(wsLink),
    headersLink.concat(batchLink),
  );

  const apolloClient = new ApolloClient({
    link: from([
      graphQLErrorLink, 
      networkErrorLink, 
      authLink,
      splitLink
    ]),
    cache: cache,
    connectToDevTools: true
  });

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </ErrorBoundary>
  );
};