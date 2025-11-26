/* eslint-disable */

const mapDBtoAlbumModel = ({
    id,
    name,
    year,
    genre,
    performer,
    created_at,
    updated_at,
    cover_url,
}) => ({
    id,
    name,
    year,
    genre,
    performer,
    createdAt: created_at,
    updatedAt: updated_at,
    coverUrl: cover_url,
});

module.exports = { mapDBtoAlbumModel }