import jwt from "jsonwebtoken"
import { privateKey } from "../private.key"

const { rule, shield, allow } = require("graphql-shield");

const isAuthenticatedUser = rule({cache: 'contextual'})(
  async (parent, args, context) => {
    const jwtoken = context.req.headers.authorization.replace('Bearer ', '')
    let userData

    try {
        userData = jwt.verify(jwtoken, privateKey)
    } catch (e) {
        console.log(e)
        return false;
    }

    if (context.dataSources.udb.userExists(userData.userId)){
      context.currentUser = userData.userId
      return true
    }

    console.log("User does not exist.")
    return false
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