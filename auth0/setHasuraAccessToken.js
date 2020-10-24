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
        'x-hasura-admin-secret': 'hasura'
      },
      url:   'https://sterling-eft-20.hasura.app/v1/graphql',
      body:  JSON.stringify({ "query": findUserQuery, "variables": variables })
  }, function(error, response, body){
      console.log('error', error);
      const { data } = JSON.parse(body);
      if (data && data.users) {
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
            callback(null, user, context);
            break;
          default:
            console.log('Duplicate users exist');
            callback(null, user, context);
            break;
        }
      } else {
        console.log('response error');
        callback(null, user, context);
      }
  });
}