import { Client } from 'minio';

// Minioクライアントの設定
const minioClient = new Client({
  endPoint: 'minio',
  port: 9000,
  useSSL: false,
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY'
});

export default minioClient;