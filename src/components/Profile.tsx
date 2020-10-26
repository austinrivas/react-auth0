import React from "react"
import { gql, useQuery } from '@apollo/client'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import Companies from './Companies'
import ErrorMessage from './ErrorMessage';

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return <ErrorMessage 
    name="Profile"
    error={error}
    resetErrorBoundary={resetErrorBoundary}
  />
}

const GET_CURRENT_USER_ID = gql`
  query {
    current_user {
      id
      auth0_id
    }
  }
`;

export default function Profile(
  { user }: 
  { user: any; }
  ) {
  const { loading, error, data } = useQuery(GET_CURRENT_USER_ID);

  if (loading) {
    return <div>loading user data...</div>
  } else if (data) {
    console.log('current_user', data?.current_user);
    const cUser = data?.current_user[0];
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>hasura id: {cUser.id}</p>
          <p>hasura auth0_id: {cUser.auth0_id}</p>
          <Companies />
        </div>
      </ErrorBoundary>
    );
  } else if(error) {
    if (error) throw error
    else throw new Error('Undefined Profile State')
  } else {
    throw new Error('User not found.')
  }
};