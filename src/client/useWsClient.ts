import {
  ApolloClient, 
  InMemoryCache, 
  from
} from '@apollo/client';
import wsLink from './wsLink'
import withToken from './withToken'

export default function useWsClient({
  uri
}: {
  uri: string;
}) {
  return new ApolloClient({
    link: from([withToken, wsLink(uri)]),
    cache: new InMemoryCache()
  });
}