import Server from './server.js';

const playground = {
  settings: {
    'schema.polling.enable': false,
  }
};

(async () => {
  const server = await Server({ playground })
  const { url } = await server.listen()
  console.log(`🚀 Server ready at ${url}`);
})();
