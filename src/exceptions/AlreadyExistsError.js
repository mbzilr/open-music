const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AlreadyExistsError';
  }
}

module.exports = NotFoundError;