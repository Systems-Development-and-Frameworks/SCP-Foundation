import { ApolloServer } from "apollo-server";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { UserDatasource } from "./datasource/user-datasource.js";
import { PostDatasource } from "./datasource/post-datasource";
import { permissions } from "./datasource/permissions.js";
import { makeExecutableSchema } from "graphql-tools";
import { applyMiddleware } from "graphql-middleware";
import { context } from "./context"

const udb = new UserDatasource();
const pdb = new PostDatasource(udb);

const dataSources = () => ({ udb, pdb });

export default class Server {
  constructor(opts) {
    const schema = makeExecutableSchema({ typeDefs, resolvers });
    const defaults = {
      UserDatasource,
      PostDatasource,
      context,
      dataSources,
    };

    return new ApolloServer({
      ...defaults,
      //...applyMiddleware(schema, permissions),
      schema,
      ...opts,
    });
  }
}
