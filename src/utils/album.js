/* eslint-disable */

const mapDBtoAlbumModel = ({
    id,
    name,
    year,
    genre,
    performer,
    created_at,
    updated_at
}) => ({
    id,
    name,
    year,
    genre,
    performer,
    createdAt: created_at,
    updatedAt: updated_at
});

module.exports = { mapDBtoAlbumModel }