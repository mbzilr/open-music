const _autoBind = require('auto-bind');
const autoBind = _autoBind.default ?? _autoBind;

class PlaylistSongActivitiesHandler {
  constructor(playlistsService, playlistSongActivitiesService) {
    this._playlistsService = playlistsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    const activities = await this._playlistSongActivitiesService.getActivities(playlistId);

    return h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
  }
}

module.exports = PlaylistSongActivitiesHandler;
