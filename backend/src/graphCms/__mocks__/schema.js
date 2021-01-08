import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { addMocksToSchema } from '@graphql-tools/mock';

export default async () => {

  const mocks = {
    Int: () => 6,
    Float: () => 22.1,
    String: () => 'Hello',
    Person: () => ({
      name:'Günther',
      id: "",
      email:"günther.jauch@aol.de"
    })
    };



  const schema = await loadSchema(join(__dirname, 'schema.gql'), {
    loaders: [
      new GraphQLFileLoader(),
    ],
  });
  return addMocksToSchema({ schema: schema, mocks: mocks });
};
