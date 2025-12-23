import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mentalhealth_db",
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  PAYMENTS_ENABLED: process.env.PAYMENTS_ENABLED !== 'false',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://local  VITE_FORMSPREE_ID=<your_form_id_here>host:5173',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'mitrastarpan1999@gmail.com',
};

export default config;
