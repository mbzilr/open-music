const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, { exportsService, producerService, validator }) => {
    const handler = new ExportsHandler({ exportsService, producerService, validator });
    server.route(routes(handler));
  },
};
