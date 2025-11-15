const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
<<<<<<< HEAD
    options: {
      auth: false
    },
=======
>>>>>>> 0d1f065 (Reworked API for Songs and Albums)
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
<<<<<<< HEAD
    options: {
      auth: false
    },
=======
>>>>>>> 0d1f065 (Reworked API for Songs and Albums)
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler,
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongByIdHandler,
<<<<<<< HEAD
    options: {
      auth: false
    },
=======
>>>>>>> 0d1f065 (Reworked API for Songs and Albums)
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongByIdHandler,
<<<<<<< HEAD
    options: {
      auth: false
    },
=======
>>>>>>> 0d1f065 (Reworked API for Songs and Albums)
  }
];

module.exports = routes;