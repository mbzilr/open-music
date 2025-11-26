const InvariantError = require('../../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schema');

const AlbumsTextValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

const AlbumsCoverValidator = {
  validate(headers) {
    const allowed = ['image/jpeg', 'image/png'];

    if (!allowed.includes(headers['content-type'])) {
      throw new InvariantError('Format file sampul album tidak valid');
    }
  }
};


module.exports = { AlbumsTextValidator, AlbumsCoverValidator };
