const { rule, shield } = require("graphql-shield");

const isAuthorised = rule()((parent, args, context) => {
    // TODO: Check JWT
    return true;
});

export const permissions = shield({
  Query: {
      users: isAuthorised
  },
  Mutation: {
    login: isAuthorised,
  }
});