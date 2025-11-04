import express from 'express';

import { connectToDb } from './configs/db.config';
import logger from './configs/logger.config';
import { connectToRedis } from './configs/redis.config';

import userAgentParser from './middlewares/userAgent.middleware';

import { appErrorHandler, notFoundErrorHandler } from './modules/exception/exception.middleware';

import appRouter from './app.routes';

const app = express();

const { APP_PORT, BASE_URL } = process.env;

const main = async () => {
  await connectToDb();
  await connectToRedis();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(userAgentParser);

  app.use(appRouter);

  app.use(notFoundErrorHandler);
  app.use(appErrorHandler);

  app.listen(Number(APP_PORT), () => logger.info(`Server run on port ${APP_PORT}: ${BASE_URL}.`));
};

main();
