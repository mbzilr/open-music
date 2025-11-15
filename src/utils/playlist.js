/* eslint-disable */

const mapDBtoPlaylistModel = ({
    id,
    name,
    owner,
    created_at,
    updated_at
}) => ({
    id,
    name,
    owner,
    createdAt: created_at,
    updatedAt: updated_at
});

module.exports = { mapDBtoPlaylistModel }