import timeout from 'connect-timeout';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';

import { connectToDb } from './configs/db.config';
import logger from './configs/logger.config';
import { connectToRedis } from './configs/redis.config';

import userAgentParser from './middlewares/userAgent.middleware';

import { appErrorHandler, notFoundErrorHandler, requestTimeoutHandler } from './modules/exception/exception.middleware';

import appRouter from './app.routes';

const app = express();

const { APP_PORT, BASE_URL, REQUEST_TIMEOUT } = process.env;

const main = async () => {
  await connectToDb();
  await connectToRedis();

  app.use(timeout(REQUEST_TIMEOUT));
  app.use(helmet());
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/public', express.static(path.join(process.cwd(), 'public')));

  app.use(userAgentParser);

  app.use(appRouter);

  app.use(notFoundErrorHandler);
  app.use(requestTimeoutHandler);
  app.use(appErrorHandler);

  app.listen(Number(APP_PORT), () => logger.info(`Server run on port ${APP_PORT}: ${BASE_URL}.`));
};

main();
