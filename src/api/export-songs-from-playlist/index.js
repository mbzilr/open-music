const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { validator, exportsService, producerService }) => {
    const handler = new ExportsHandler({ validator, exportsService, producerService });
    server.route(routes(handler));
  },
};
