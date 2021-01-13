import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { addMocksToSchema, mockServer } from '@graphql-tools/mock';
import { wrapSchema } from '@graphql-tools/wrap';
import { print } from 'graphql';
import { mocks } from './mockData';

export const executor = async ({ document, variables }) => {
  const query = print(document);

  const schema = await loadSchema(join(__dirname, 'schema.gql'), {
    loaders: [
      new GraphQLFileLoader(),
    ],
  });

  const server =  mockServer(
    schema,
    mocks,
    false
  )

  return server.query(query)
};

export default async () => {


  const schema = await loadSchema(join(__dirname, 'schema.gql'), {
    loaders: [
      new GraphQLFileLoader(),
    ],
  });

  const schemaWithMocks = addMocksToSchema({
    schema,
    mocks: mocks,
    preserveResolvers: false
  })

    return wrapSchema({
      schema: schemaWithMocks,
      executor
    })
};
