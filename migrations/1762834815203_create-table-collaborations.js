/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('collaborations', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('collaborations', 'fk_playlist_id', {
    foreignKeys: {
      columns: 'playlist_id',
      references: 'playlists(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.addConstraint('collaborations', 'fk_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }
  });

  pgm.addConstraint('collaborations', 'unique_playlist_user', {
    unique: ['playlist_id', 'user_id']
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'fk_playlist_id');
  pgm.dropConstraint('collaborations', 'fk_user_id');
  pgm.dropConstraint('collaborations', 'unique_playlist_user');
  pgm.dropTable('collaborations');
};
