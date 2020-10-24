import { ServerError } from '@apollo/client';

export default function isServerError(error: Error | undefined): error is ServerError {
  return error !== undefined && error.name === 'ServerError';
}