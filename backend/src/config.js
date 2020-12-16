require('dotenv-flow').config();
export const privateKey = process.env.JWT_SECRET
export const graphCmsEndpoint = process.env.GRAPH_CMS_ENDPOINT
export const graphCmsApiToken = process.env.GRAPH_CMS_API_TOKEN
