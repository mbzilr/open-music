const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1500).required(),
  genre: Joi.string().optional().allow(null),
  performer: Joi.string().optional().allow(null),
});

module.exports = { AlbumPayloadSchema };
