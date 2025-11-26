const AlbumsLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums-likes',
  version: '1.0.0',
  register: async (server, { albumsLikesService, albumsService, validator }) => {
    const handler = new AlbumsLikesHandler({ albumsLikesService, albumsService, validator });
    server.route(routes(handler));
  },
};
