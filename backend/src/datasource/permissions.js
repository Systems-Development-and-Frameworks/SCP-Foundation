import jwt from "jsonwebtoken"
import { privateKey } from "../private.key"

const { rule, shield } = require("graphql-shield");

const isAuthorised = rule()((parent, args, context) => {
    const jwtoken = context.req.headers.authorization.replace('Bearer ', '')
    let userData

    try {
        userData = jwt.verify(jwtoken, privateKey)
    } catch (e) {
        console.log(e)
        return false;
    }

    if (context.dataSources.udb.userExists(userData.userId))
      return true

    console.log("User does not exist.")
    return false
});

export const permissions = shield({
  Query: {
    users: isAuthorised
  },
  Mutation: {
    write: isAuthorised,
  }
});