const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, storageService, textValidator, imageValidator }) => {
    const handler = new AlbumsHandler(service, storageService, textValidator, imageValidator);
    server.route(routes(handler));
  },
};
