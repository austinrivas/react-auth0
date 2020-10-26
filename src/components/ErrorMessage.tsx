import React from "react";
import { FallbackProps } from 'react-error-boundary'
import LogoutButton from "./LogoutButton";

interface ErrorMessageProps extends FallbackProps {
  name: string;
}

export default function ErrorMessage(
  {name, error, resetErrorBoundary}: ErrorMessageProps
  ) {
  return (
    <div role="alert">
      <p>Something went wrong in {name} component.</p>
      <pre>{error ? error.message : "Undefined error."}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
      <LogoutButton />
    </div>
  )
}