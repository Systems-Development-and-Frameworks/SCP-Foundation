const { rule, shield, allow } = require("graphql-shield");

const isAuthenticatedUser = rule({cache: 'contextual'})(
  async (parent, args, context) => {
    let userData = context.userData

    if (context.dataSources.udb.userExists(userData.userId)){
      console.log("User does exist.")
      context.currentUser = userData.userId
      return true
    }else {
      console.log("User does not exist.")
      return false
    }
    
})

export const permissions = shield({
  Query: {
    users: allow,
    posts: allow,
  },
  Mutation: {
    write: isAuthenticatedUser,
    upvote: isAuthenticatedUser,
    downvote: isAuthenticatedUser,
    delete: isAuthenticatedUser,
  }
});