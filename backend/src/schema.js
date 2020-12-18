import { stitchSchemas } from '@graphql-tools/stitch';
import { applyMiddleware } from 'graphql-middleware';
import { typeDefs } from './typeDefs';
import { permissions } from './datasource/permissions';
import Resolvers from './resolvers';
import GraphCmsSchema, { executor } from './graphCms/schema';

export default async () => {
  const graphCmsSchema = await GraphCmsSchema();
  const resolvers = Resolvers({ schema: graphCmsSchema, executor });

  let gatewaySchema = stitchSchemas({
    subschemas: [
      graphCmsSchema,
    ],
    typeDefs,
    resolvers,
  });

  // TODO: add permissions
  gatewaySchema = applyMiddleware(gatewaySchema);//, permissions);
  return gatewaySchema;
};