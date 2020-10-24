import React from "react";
import { gql, useQuery } from '@apollo/client';
import LogoutButton from './LogoutButton';

const GET_CURRENT_USER = gql`
  query current_user {
    id
  }
`;

export default function Profile(
  { user }: 
  { user: any; }
  ) {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);

  if (loading) {
    return <div>loading user data...</div>
  } else if (data) {
    console.log(data)
    return (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <p>{data.current_user.id}</p>
        <LogoutButton />
      </div>
    );
  } else {
    throw error
  }
};