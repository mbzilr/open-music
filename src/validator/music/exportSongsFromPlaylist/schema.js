const Joi = require('joi');
const InvariantError = require('../../../exceptions/InvariantError');

const ExportSongsPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: false }).required(),
});

module.exports = ExportSongsPayloadSchema;