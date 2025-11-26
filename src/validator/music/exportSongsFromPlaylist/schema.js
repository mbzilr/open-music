const Joi = require('joi');

const ExportSongsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: false }).required(),
});

module.exports = { ExportSongsPayloadSchema };