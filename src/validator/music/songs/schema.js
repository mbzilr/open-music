const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().optional().allow(null),
  albumId: Joi.string().optional().allow(null),
});

module.exports = { SongPayloadSchema };
