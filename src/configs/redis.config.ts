import { createClient } from 'redis';

import logger from './logger.config';

const REDIS_URL = process.env.REDIS_URL;

const redisClient = createClient({ url: REDIS_URL });

const connectToRedis = async () => {
  try {
    await redisClient.connect();

    logger.info('Server connected to Redis.');
  } catch (error) {
    throw error;
  }
};

export { connectToRedis };
export default redisClient;
