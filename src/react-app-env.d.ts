/// <reference types="react-scripts" />
// eslint-disable-next-line
namespace NodeJS {
  // eslint-disable-next-line
  interface ProcessEnv {
    REACT_APP_AUTH0_CLIENT_ID: string;
    REACT_APP_AUTH0_DOMAIN: string;
    REACT_APP_AUTH0_AUDIENCE: string;
    REACT_APP_HASURA_GRAPHQL_WSS_ENDPOINT: string;
    NODE_ENV: 'development' | 'production';
  }
}
