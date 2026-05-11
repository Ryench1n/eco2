import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB || 'eco_development',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'eco-jwt-secret-key-change-in-production',
    expiresIn: '7d',
  },
};

export default config;
