import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import logger from './logger.config';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: DB_CONNECTION_LIMIT,
});

const db = drizzle(pool);

const connectToDb = async () => {
  try {
    await pool.query('SELECT 1');

    logger.info('Server connected to MySQL.');
  } catch (error) {
    throw error;
  }
};

export { connectToDb };
export default db;
