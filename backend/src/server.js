import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { UserDatasource } from './datasource/user-datasource.js';
import { PostDatasource } from './datasource/post-datasource';

const udb = new UserDatasource();
const pdb = new PostDatasource(udb);

const dataSources = () => ({ udb, pdb })

const context = ({ req, res }) => ({req, res})

export default class Server {
    constructor (opts) {
      const defaults = {
        typeDefs,
        resolvers,
        UserDatasource,
        PostDatasource,
        context,
        dataSources
      }
      return new ApolloServer({ ...defaults, ...opts })
    }
  }