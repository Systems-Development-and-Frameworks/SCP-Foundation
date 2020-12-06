import Server from './server.js';

require("dotenv").config();
const server = new Server();
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
