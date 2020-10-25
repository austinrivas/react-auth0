import React from "react";
import { gql, useSubscription } from '@apollo/client';
import Company from "./Company";

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
    console.log('companies', companies);
    return (
      <div>
        <p>Companies</p>
        <ul>
          {companies.map(Company)}
        </ul>
      </div>
    )
  } else {
    if (error) throw error
    else throw new Error('Undefined State')
  }
}