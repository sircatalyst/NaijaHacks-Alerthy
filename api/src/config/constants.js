import dotenv from 'dotenv';

dotenv.config();
const {
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  PORT,
} = process.env;

export {
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_HOST,
  PORT,
};
