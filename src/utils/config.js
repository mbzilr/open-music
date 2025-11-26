const config = {
    server: {
        host: process.env.HOST,
        port: process.env.PORT,
    },
    s3: {
        bucketName: process.env.AWS_BUCKET_NAME,
    },
    rabbitMq: {
        server: process.env.RABBITMQ_SERVER,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
}

module.exports = config;