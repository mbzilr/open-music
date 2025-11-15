const _autoBind = require('auto-bind');
const autoBind = _autoBind.default ?? _autoBind;
const AuthenticationError = require('../../exceptions/AuthenticationError');

class AlbumsHandler {
  constructor(service, validator) {
    (this._service = service), (this._validator = validator);

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    if (!request.auth.isAuthenticated) {
      throw new AuthenticationError('Missing authentication');
    }

    const { name, year, genre, performer } = request.payload;

    const albumId = await this._service.addAlbum({
      name,
      year,
      genre,
      performer,
    });

    const response = h.response({
      status: 'success',
      data: { albumId },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

    return {
      status: 'success',
      data: { album },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    if (!request.auth.isAuthenticated) {
      throw new AuthenticationError('Missing authentication');
    }

    const { id } = request.params;
    const { name, year, genre, performer } = request.payload;

    await this._service.editAlbumById(id, { name, year, genre, performer });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  async deleteAlbumByIdHandler(request, h) {
    if (!request.auth.isAuthenticated) {
      throw new AuthenticationError('Missing authentication');
    }

    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: 'success',
      message: 'Album berhasil dihapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = AlbumsHandler;
