const InvariantError = require('../../../exceptions/InvariantError');
const { PlaylistSongActivityPayloadSchema } = require('./schema');

const PlaylistSongActivitiesValidator = {
  validatePlaylistSongActivityPayload: (payload) => {
    const validationResult = PlaylistSongActivityPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongActivitiesValidator;
