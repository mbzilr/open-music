/* eslint-disable */
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
        type: 'VARCHAR(50)',
        primaryKey: true
    },
    name: { 
        type: 'VARCHAR(75)', 
        notNull: true 
    },
    year: { 
        type: 'INTEGER', 
        notNull: true, 
        check: "year >= 1500" 
    },
    genre: { 
        type: 'TEXT', 
        notNull: false 
    },
    performer: {
        type: 'TEXT',
        notNull: false 
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable('albums');
};
