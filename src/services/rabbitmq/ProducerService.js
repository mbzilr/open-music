const amqp = require('amqplib');

class ProducerService {
    constructor() {
        this._connection = null;
        this._channel = null;
    }

    async _connect() {
        if (!this._connection) {
            this._connection = await amqp.connect(process.env.RABBITMQ_SERVER);
            this._channel = await this._connection.createChannel();
        }
    }

    async sendMessage(queue, message) {
        await this._connect();
        await this._channel.assertQueue(queue, { durable: true });
        this._channel.sendToQueue(queue, Buffer.from(message));
    }
}

module.exports = ProducerService;