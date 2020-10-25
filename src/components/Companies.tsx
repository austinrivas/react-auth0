import React from "react";
import { gql, useSubscription } from '@apollo/client';

const SUB_COMPANIES = gql`
  subscription {
    companies {
      id
    }
  }
`;

export default function Companies() {
  const { loading, error, data } = useSubscription(SUB_COMPANIES);

  if (loading) {
    return <div>Loading Companies...</div>
  } else if (data) {
    const companies = data?.companies;
    return (
      <div>
        <p>Companies</p>
        <ul>
          {companies.map(({ id }: { id: string }) => <li key={id}>{id}</li>)}
        </ul>
      </div>
    )
  } else {
    if (error) throw error
    else throw new Error('Undefined State')
  }
}