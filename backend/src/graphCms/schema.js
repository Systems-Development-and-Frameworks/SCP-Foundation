import { fetch } from 'cross-fetch';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { print } from 'graphql';
import { graphCmsApiToken, graphCmsEndpoint } from '../config';

const executor = async ({ document, variables }) => {
  const query = print(document);
  const headers = { 'Content-Type': 'application/json' };
  if (graphCmsApiToken) headers.Authorization = `Bearer ${graphCmsApiToken}`;

  const fetchResult = await fetch(graphCmsEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  return fetchResult.json();
};

export default async () => wrapSchema({
  schema: await introspectSchema(executor),
  executor,
});