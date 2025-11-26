const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const config = require('../../utils/config.js');

class S3StorageService {
  constructor() {
    this._client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this._bucket = config.s3.bucketName;
    this._baseUrl = process.env.AWS_BUCKET_URL;
  }

  async uploadFile(file, meta) {
    const sanitizedName = meta.filename.replace(/\s+/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: this._bucket,
      Key: filename,
      Body: file._data,
      ContentType: meta.headers['content-type'],
      ACL: 'public-read',
    });

    await this._client.send(command);

    return `${this._baseUrl}/${filename}`;
  }
}

module.exports = S3StorageService;