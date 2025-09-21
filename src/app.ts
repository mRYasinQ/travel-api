import express from 'express';

import { connectToDb } from './configs/db.config';
import logger from './configs/logger.config';
import { connectToRedis } from './configs/redis.config';

import { notFoundErrorHandler } from './modules/exception/exception.middleware';

import appRouter from './app.routes';

const app = express();

const { APP_PORT, BASE_URL } = process.env;

const main = async () => {
  await connectToDb();
  await connectToRedis();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(appRouter);

  app.use(notFoundErrorHandler);

  app.listen(APP_PORT, () => logger.info(`Server run on port ${APP_PORT}: ${BASE_URL}.`));
};

main();
