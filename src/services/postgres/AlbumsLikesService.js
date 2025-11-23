const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AlreadyExistsError = require('../../exceptions/AlreadyExistsError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsLikesService {
  constructor({ albumsService, cacheService }) {
    this._pool = new Pool();
    this._albumsService = albumsService;
    this._cacheService = cacheService;
    this._cacheKeyPrefix = 'album_likes';
  }

  _cacheKey(albumId) {
    return `${this._cacheKeyPrefix}:${albumId}`;
  }

  async addLike({ userId, albumId }) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes(id, user_id, album_id) VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    };

    await this._pool.query(query);
    return id;
  }

  async removeLike({ userId, albumId }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    };
    const result = await this._pool.query(query);
    return result.rowCount;
  }

  async exists({ userId, albumId }) {
    const query = {
      text: 'SELECT 1 FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    return !!result.rowCount;
  }

  async countByAlbumId(albumId) {
    const query = {
      text: 'SELECT COUNT(*)::int AS likes FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows[0] ? Number(result.rows[0].likes) : 0;
  }

  async likeAlbum(userId, albumId) {
    await this._albumsService.getAlbumById(albumId);

    const exists = await this.exists({ userId, albumId });
    if (exists) {
      throw new AlreadyExistsError('Like sudah ada');
    }

    await this.addLike({ userId, albumId });
    await this._cacheService.delete(this._cacheKey(albumId));
  }

  async unlikeAlbum(userId, albumId) {
    await this._albumsService.getAlbumById(albumId);

    const exists = await this.removeLike({ userId, albumId });
    if (!exists) {
      throw new NotFoundError('Like tidak ditemukan');
    }
    await this._cacheService.delete(this._cacheKey(albumId));
  }

  async getAlbumLikes(albumId) {
    const cacheKey = this._cacheKey(albumId);
    const cached = await this._cacheService.get(cacheKey);
    if (cached != null) {
      return { likes: Number(cached), source: 'cache' };
    }

    await this._albumsService.getAlbumById(albumId);
    const likes = await this.countByAlbumId(albumId);

    await this._cacheService.set(cacheKey, likes);

    return { likes, source: 'db' };
  }
}

module.exports = AlbumsLikesService;