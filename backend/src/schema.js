import { stitchSchemas } from '@graphql-tools/stitch';
import { applyMiddleware } from 'graphql-middleware';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { permissions } from './datasource/permissions';
import GraphCmsSchema from './graphCms/schema';

export default async () => {
  const graphCmsSchema = await GraphCmsSchema();
  const resolvers = resolvers({ subschema: graphCmsSchema });

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