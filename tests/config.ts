import dotenv from 'dotenv';

dotenv.config();

export const TEST_USER = {
  username: process.env.TEST_USERNAME || 'testuser',
  password: process.env.TEST_PASSWORD || 'testpass',
};
