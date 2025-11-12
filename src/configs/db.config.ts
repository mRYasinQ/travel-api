import { drizzle } from 'drizzle-orm/mysql2';
import ms from 'ms';
import mysql from 'mysql2/promise';

import getErrorMessage from '../common/utils/getErrorMessage';

import redisCache from './cache.config';
import entities from './entities.config';
import logger from './logger.config';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_CONNECTION_LIMIT, DB_CACHE_QUERY_DEFAULT } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: Number(DB_CONNECTION_LIMIT),
});

const cache = redisCache({ px: ms(DB_CACHE_QUERY_DEFAULT) });
const db = drizzle(pool, { schema: entities, mode: 'default', cache });

const connectToDb = async () => {
  try {
    await pool.query('SELECT 1');

    logger.info('Server connected to MySQL.');
  } catch (error) {
    logger.error(`Server cannot connect to MySQL, Error: ${getErrorMessage(error)}`);
  }
};

export { connectToDb };
export default db;
