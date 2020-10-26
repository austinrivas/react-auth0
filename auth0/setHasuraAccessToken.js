function (user, context, callback) {
  const namespace = "https://hasura.io/jwt/claims";
  const findUserQuery = `
    query($auth0_id: String!) {
      users(where: {auth0_id: {_eq: $auth0_id}}) {
        id
      }
    }`;
  const variables = { 
    "auth0_id": user.user_id
  };

  request.post({
      headers: {
        'content-type' : 'application/json',
        'x-hasura-client-name': 'auth0-rule-setHasuraAccessToken', 
        'x-hasura-admin-secret': configuration.HASURA_ADMIN_SECRET
      },
      url:   configuration.HASURA_URL,
      body:  JSON.stringify({ "query": findUserQuery, "variables": variables })
  }, function(error, response, body){
      const { data } = JSON.parse(body);
      if (data && data.users && data.users.length) {
        const users = data.users;
        switch(users.length) {
          case 1:
            context.accessToken[namespace] =
            {
              'x-hasura-default-role': 'user',
              'x-hasura-allowed-roles': ['user'],
              'x-hasura-auth0-id': user.user_id,
              'x-hasura-user-id': users[0].id
            };
            callback(null, user, context);
            break;
          case 0:
            console.log('No user found');
            context.accessToken[namespace] =
            {
              'x-hasura-default-role': 'anonymous',
              'x-hasura-allowed-roles': ['anonymous'],
              'x-hasura-auth0-id': user.user_id
            };
            callback(null, user, context);
            break;
          default:
            console.log('Duplicate users exist');
            context.accessToken[namespace] =
            {
              'x-hasura-default-role': 'anonymous',
              'x-hasura-allowed-roles': ['anonymous'],
              'x-hasura-auth0-id': user.user_id
            };
            callback(null, user, context);
            break;
        }
      } else {
        console.log('response error', error);
        context.accessToken[namespace] =
        {
          'x-hasura-default-role': 'anonymous',
          'x-hasura-allowed-roles': ['anonymous'],
          'x-hasura-auth0-id': user.user_id
        };
        callback(null, user, context);
      }
  });
}