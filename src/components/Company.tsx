import React from "react";
import Users from "./Users";
import ErrorMessage from './ErrorMessage';
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return <ErrorMessage 
    name="Company"
    error={error}
    resetErrorBoundary={resetErrorBoundary}
  />
}

export default function Company({ id }: { id: string }) {
  return (
    <li key={id}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <p>{id}</p>
        <Users company_id={id} role_id="company_member" />
      </ErrorBoundary>
    </li>
  )
}