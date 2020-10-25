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
    return { auth0Token: await getAccessTokenSilently() };
  });

  const headersLink = setContext(async (_, { headers, auth0Token }) => {
    return {
      headers: {
        ...headers,
        Authorization: formatAuthHeader(auth0Token)
      }
    }
  });

  const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT,
    options: {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        const auth0Token = await getAccessTokenSilently();
        return {
          headers: {
            Authorization: formatAuthHeader(auth0Token)
          }
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
    wsLink,
    from([authLink, headersLink, batchLink]),
  );

  const apolloClient = new ApolloClient({
    link: from([
      graphQLErrorLink, 
      networkErrorLink,
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