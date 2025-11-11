import type { ErrorRequestHandler, RequestHandler } from 'express';

import logger from '../../configs/logger.config';

import type { HttpStatusCodeKeys } from '../../common/constants/HttpStatusCode';
import AppError from '../../common/utils/AppError';
import createResponse from '../../common/utils/createResponse';
import formatMessage from '../../common/utils/formatMessage';

import ExceptionMessage from './exception.message';

const notFoundErrorHandler: RequestHandler = (req, res) => {
  return createResponse(
    res,
    'NOT_FOUND',
    formatMessage(ExceptionMessage.NOT_FOUND, { method: req.method, route: req.originalUrl }),
    undefined,
    true,
  );
};

const requestTimeoutHandler: ErrorRequestHandler = (err, req, res, next) => {
  const isTimedout = req.timedout || err?.code === 'ETIMEDOUT';
  if (isTimedout) {
    if (res.headersSent) return;
    return createResponse(res, 'SERVICE_UNAVAILABLE', ExceptionMessage.SERVICE_UNAVAILABLE, undefined, true);
  }

  return next(err);
};

const appErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let status: HttpStatusCodeKeys = 'INTERNAL_SERVER_ERROR';
  let message: string = ExceptionMessage.INTERNAL_SERVER;
  let isOperationalError: boolean = false;

  if (err instanceof AppError) {
    if (err.isOperational) {
      status = err.status;
      message = err.message;
      isOperationalError = true;
    }
  }

  if (!isOperationalError) logger.error(err);

  return createResponse(res, status, message, undefined, true);
};

export { notFoundErrorHandler, requestTimeoutHandler, appErrorHandler };
