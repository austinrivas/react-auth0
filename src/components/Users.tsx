import React from "react";
import { gql, useQuery } from '@apollo/client';
import User from "./User"

const GET_USERS = gql`
  query ($company_id: String!, $role_id: String!) {
    users(where: {flattened_user_company_roles: {role_id: {_eq: $role_id}, company_id: {_eq: $company_id}}}) {
      id
      auth0_id
      user_company_roles {
        role_id
        company_id
      }
    }
  }
`;

export default function Users(
  {role_id, company_id}: {role_id: string, company_id: string}
  ) {
  const { loading, error, data } = useQuery(GET_USERS, {
    variables: {role_id: role_id, company_id: company_id}
  });

  if (loading) {
    return <div>Loading Users...</div>
  } else if (data) {
    const users = data.users || [];
    console.log(company_id, users);

    if (users.length) {
      return (
        <div>
          <p>Users</p>
          <ul>
            {users.map(User)}
          </ul>
        </div>
      )
    } else {
      return <div>No Members.</div>
    }
  } else {
    if (error) throw error
    else throw new Error('Undefined State')
  }
}