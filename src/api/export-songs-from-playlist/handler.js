const _autoBind = require('auto-bind');
const autoBind = _autoBind.default ?? _autoBind;

class ExportsHandler {
  constructor({ validator, exportsService, producerService }) {
    this._validator = validator;
    this._exportsService = exportsService;
    this._producerService = producerService;

    autoBind(this);
  }

  async postExportSongsHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);

    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { targetEmail } = request.payload;

    await this._exportsService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage(
      'export:songs',
      JSON.stringify(message),
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
