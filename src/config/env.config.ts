import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.port,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME,
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    mongo_url: process.env.MONGO_URL,
  },
  server: {
    port: parseInt(process.env.SERVER_PORT || '3000', 10),
    environment: process.env.NODE_ENV || 'development',
  },
  jwt: {
    secret: process.env.SECRET_KEY,
    expiry: process.env.JWT_EXPIRY,
  },
  cloudinary: {
    name: process.env.CLOUD_NAME,
    key: process.env.CLOUDINARY_API_KEY,
    secret: process.env.CLOUDINARY_API_SECRET,
  },
  mail: {
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    port: process.env.MAIL_PORT,
    from: process.env.MAIL_FROM,
  },
};
