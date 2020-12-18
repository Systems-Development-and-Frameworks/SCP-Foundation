import { ApolloServer } from "apollo-server";
import { UserDatasource } from "./datasource/user-datasource.js";
import { PostDatasource } from "./datasource/post-datasource";
import { context } from "./context"
import Schema from "./schema"

const udb = new UserDatasource();
const pdb = new PostDatasource(udb);

const dataSources = () => ({ udb, pdb });

export default async (opts) => {
  const defaults = {
    UserDatasource,
    PostDatasource,
    context,
    dataSources,
  };
  
  const schema = await Schema();
  const server = new ApolloServer({
    ...defaults,
    schema, 
    ...opts });
  return server;
};
