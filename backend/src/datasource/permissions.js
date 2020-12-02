import jwt from "jsonwebtoken"
import { privateKey } from "../private.key"

const { rule, shield } = require("graphql-shield");

const isAuthorised = rule()((parent, args, context) => {
    const jwtoken = context.req.headers.authorization.replace('Bearer ', '');

    try {
        const userData = jwt.verify(jwtoken, privateKey)
    } catch (e) {
        return false;
    }
    
    return true;
});

export const permissions = shield({
  Query: {
    users: isAuthorised
  },
  Mutation: {
    write: isAuthorised,
  }
});