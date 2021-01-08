const { rule, shield, allow } = require("graphql-shield");

const isAuthenticatedUser = rule({cache: 'contextual'})(
  async (parent, args, context) => {
    let userData = context.userData

    if (context.dataSources.udbg.userExists(userData.userId)){
      context.currentUser = userData.userId
      return true
    }else {
      console.log("User does not exist.")
      return false
    }
    
})

export const permissions = shield({
  Query: {
    people: allow,
    posts: allow,
  },
  Mutation: {
    write: isAuthenticatedUser,
    vote: isAuthenticatedUser,
    delete: isAuthenticatedUser,
  }
});