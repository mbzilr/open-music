const redis = require('redis');
const config = require('../../utils/config.js');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: config.redis.host || '127.0.0.1',
        port: config.redis.port || 6379
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async connect() {
    if (!this._client.isOpen) {
      await this._client.connect();
    }
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    return await this._client.get(key);
  }


  async delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;