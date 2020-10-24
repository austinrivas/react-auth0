import { setContext } from '@apollo/client/link/context'
import { onError } from "@apollo/client/link/error"
import { useAuth0 } from "@auth0/auth0-react"

import isServerError from './isServerError'

let token: string | null;

const resetToken = onError(({ networkError }) => {
  if (
    isServerError(networkError) &&
    networkError.statusCode === 401
  ) {
    // remove cached token on 401 from the server
    token = null;
  }
});

export default setContext(async (_, { headers, ...context }) => {
  const { getAccessTokenSilently } = useAuth0();
  if (!token) token = await getAccessTokenSilently();
  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`
    },
    ...context
  }
}).concat(resetToken)