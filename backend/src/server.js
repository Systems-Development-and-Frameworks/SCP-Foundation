import { ApolloServer } from "apollo-server";
import { UserDatasource } from "./datasource/user-datasource";
import { UserDatasourceGraphCms } from "./datasource/user-datasource-graphcms";
import { PostDatasource } from "./datasource/post-datasource";
import { context } from "./context"
import Schema from "./schema"

const udb = new UserDatasource();
const udbg = new UserDatasourceGraphCms();
const pdb = new PostDatasource(udb);

const dataSources = () => ({ udb, udbg, pdb });
// const mocks = {
//   Int: () => 6,
//   Float: () => 22.1,
//   String: () => 'Hello',
//   };

export default async (opts) => {
  const defaults = {
    UserDatasource,
    UserDatasourceGraphCms,
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
