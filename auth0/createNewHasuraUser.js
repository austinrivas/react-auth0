function (user, context, callback) {
  const insertUserQuery = `
    mutation($id: citext, $auth0_id: String!){
      insert_users(
        objects: [{
          id: $id, 
          auth0_id: $auth0_id 
        }], 
        on_conflict: { constraint: users_auth0_id_key, update_columns: [] }
      ) {
        affected_rows
      }
    }`;
  const variables = {
    "id": user.email,
    "auth0_id": user.user_id
  };

  request.post({
      headers: {
        'content-type' : 'application/json',
        'x-hasura-client-name': 'auth0-rule-createNewHasuraUser',
        'x-hasura-admin-secret': configuration.HASURA_ADMIN_SECRET 
      },
      url:   configuration.HASURA_URL,
      body:  JSON.stringify({ "query": insertUserQuery, "variables": variables })
  }, function(error, response, body){
       console.log('error', error);
       console.log('body', body);
       callback(null, user, context);
  });
}