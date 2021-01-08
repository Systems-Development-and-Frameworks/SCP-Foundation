import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { addMocksToSchema, mockServer } from '@graphql-tools/mock';
import { wrapSchema } from '@graphql-tools/wrap';
import { print } from 'graphql';

export const executor = async ({ document, variables }) => {
  const query = print(document);

  const mocks = {
    Int: () => 6,
    Float: () => 22.1,
    String: () => 'Hello',
    Post: () => ({
      id: "post id",
      title: "title"
    }),
    Person: () => ({
      id: "Person id",
      name:'Günther',
      email:"günther.jauch@aol.de",
      password:"password"
    })
    };

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

  const mocks = {
    Int: () => 6,
    Float: () => 22.1,
    String: () => 'Hello',
    Post: () => ({
      id: "post id",
      title: "title"
    }),
    Person: () => ({
      id: "Person id",
      name:'Günther',
      email:"günther.jauch@aol.de"
    })
    };



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
