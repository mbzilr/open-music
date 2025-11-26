const _autoBind = require('auto-bind');
const autoBind = _autoBind.default ?? _autoBind;

class AlbumsLikesHandler {
  constructor({ albumsLikesService, albumsService, validator }) {
    (this._service = albumsLikesService),
    (this._albumsService = albumsService),
    (this._validator = validator);

    autoBind(this);
  }

  async postLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.likeAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album ditandai sebagai suka',
    });
    response.code(201);
    return response;
  }

  async deleteLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.unlikeAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Album tidak ditandai sebagai suka'
    });
    response.code(200);
    return response;
  }

  async getLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, source } = await this._service.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    response.header('X-Data-Source', source === 'cache' ? 'cache' : 'db');
    response.code(200);
    return response;
  }
}

module.exports = AlbumsLikesHandler;
