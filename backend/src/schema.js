import { stitchSchemas } from '@graphql-tools/stitch';
import { applyMiddleware } from 'graphql-middleware';
import { typeDefs } from './typeDefs';
import { permissions } from './datasource/permissions';
import Resolvers from './resolvers';
import GraphCmsSchema from './graphCms/schema';

export default async () => {
  const graphCmsSchema = await GraphCmsSchema();
  const resolvers = Resolvers({ schema: graphCmsSchema });

  let gatewaySchema = stitchSchemas({
    subschemas: [
      graphCmsSchema,
    ],
    typeDefs,
    resolvers,
  });

  gatewaySchema = applyMiddleware(gatewaySchema, permissions);
  return gatewaySchema;
};