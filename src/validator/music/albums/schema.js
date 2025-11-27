const Joi = require('joi');

const currentYear = new Date().getFullYear();

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(currentYear).required(),
  genre: Joi.string().optional().allow(null),
  performer: Joi.string().optional().allow(null),
});

module.exports = { AlbumPayloadSchema };
