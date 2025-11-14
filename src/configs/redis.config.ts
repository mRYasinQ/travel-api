import Redis from 'ioredis';

import getErrorMessage from '../common/utils/getErrorMessage';

import logger from './logger.config';

const REDIS_URL = process.env.REDIS_URL;

const redisClient = new Redis(REDIS_URL);

const connectToRedis = async () => {
  try {
    await redisClient.ping();

    logger.info('Server connected to Redis.');
  } catch (error) {
    logger.error(`Server cannot connect to Redis, Error: ${getErrorMessage(error)}`);
  }
};

export { connectToRedis };
export default redisClient;
