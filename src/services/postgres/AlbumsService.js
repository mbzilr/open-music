const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBtoAlbumModel } = require('../../utils/album');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year, genre = null, performer = null }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const coverURL = null;
    const query = {
      text: `
                INSERT INTO albums (id, name, year, genre, performer, created_at, updated_at, cover_url)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `,
      values: [id, name, year, genre, performer, createdAt, updatedAt, coverURL],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]?.id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year, genre, performer, cover_url FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [id],
    };
    const songsResult = await this._pool.query(songsQuery);

    return {
      ...mapDBtoAlbumModel(result.rows[0]),
      songs: songsResult.rows,
    };
  }

  async editAlbumById(id, { name, year, genre = null, performer = null }) {
    const now = new Date().toISOString();
    const query = {
      text: `
                UPDATE albums
                SET name = $1, year = $2, genre = $3, performer = $4, updated_at = $5
                WHERE id = $6
                RETURNING id
            `,
      values: [name, year, genre, performer, now, id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async updateAlbumCover(id, coverUrl) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui sampul. Album tidak ditemukan');
    }

    return result.rows[0].id;
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 returning id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = AlbumsService;