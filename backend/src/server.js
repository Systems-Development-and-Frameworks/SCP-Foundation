import { ApolloServer } from "apollo-server";
import { UserDatasource } from "./datasource/user-datasource.js";
import { PostDatasource } from "./datasource/post-datasource";
import { context } from "./context"
import Schema from "./schema"

const udb = new UserDatasource();
const pdb = new PostDatasource(udb);

const dataSources = () => ({ udb, pdb });

export default class Server {
  constructor(opts) {
    //const schema = makeExecutableSchema({ typeDefs, resolvers });
    const defaults = {
      UserDatasource,
      PostDatasource,
      context,
      dataSources,
    };

    // TODO: find workaround for await
    const schema = await Schema()
    return new ApolloServer({
      ...defaults,
      schema,
      ...opts,
    });
  }
}

// export default async (ApolloServer, opts) => {
//   const schema = await Schema();
//   const server = new ApolloServer({ schema, context, ...opts });
//   return server;
// };
