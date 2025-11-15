const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.postAlbumHandler,
<<<<<<< HEAD
    options: {
      auth: false,
    },
=======
>>>>>>> 0d1f065 (Reworked API for Songs and Albums)
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.putAlbumByIdHandler,
<<<<<<< HEAD
    options: {
      auth: false,
    },
=======
>>>>>>> 0d1f065 (Reworked API for Songs and Albums)
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumByIdHandler,
<<<<<<< HEAD
    options: {
      auth: false,
    },
=======
>>>>>>> 0d1f065 (Reworked API for Songs and Albums)
  },
];

module.exports = routes;
