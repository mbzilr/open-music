const _autoBind = require('auto-bind');
const autoBind = _autoBind.default ?? _autoBind;

class AlbumsHandler {
  constructor(service, storageService, textValidator, imageValidator) {
    (this._service = service),
    (this._storageService = storageService),
    (this._albumTextValidator = textValidator),
    (this._albumCoverValidator = imageValidator),

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._albumTextValidator.validateAlbumPayload(request.payload);

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

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const albumId = request.params.id;

    this._albumCoverValidator.validate(cover.hapi.headers);

    const url = await this._storageService.uploadFile(cover, cover.hapi);

    await this._service.updateAlbumCover(albumId, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul album berhasil diunggah'
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
    this._albumTextValidator.validateAlbumPayload(request.payload);

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
