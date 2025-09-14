import express from 'express';

import logger from './configs/logger.config';
import { connectToRedis } from './configs/redis.config';
import { connectToDb } from './configs/db.config';

const app = express();

const { APP_PORT, BASE_URL } = process.env;

const main = async () => {
  try {
    await connectToRedis();
    await connectToDb();
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      logger.error(JSON.stringify(error));
    }
  } finally {
    app.listen(APP_PORT, () => logger.info(`Server run on port ${APP_PORT}: ${BASE_URL}.`));
  }
};

main();
