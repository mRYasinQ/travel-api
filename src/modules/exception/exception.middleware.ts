import type { ErrorRequestHandler, RequestHandler } from 'express';
import { MulterError } from 'multer';

import logger from '../../configs/logger.config';

import type { HttpStatusCodeKeys } from '../../common/constants/HttpStatusCode';
import createResponse from '../../common/helpers/createResponse';
import formatMessage from '../../common/helpers/formatMessage';
import { cleanupFiles } from '../../common/helpers/upload';
import AppError from '../../common/utils/AppError';

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
  if (!isTimedout) return next(err);

  if (res.headersSent) return;

  const timeoutError = new AppError(ExceptionMessage.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE');

  return next(timeoutError);
};

const appErrorHandler: ErrorRequestHandler = async (err, req, res, _next) => {
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

  if (err instanceof MulterError) {
    status = 'BAD_REQUEST';
    isOperationalError = true;

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = ExceptionMessage.FILE_LARGE;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = ExceptionMessage.UNEXPECTED_FILE;
    } else {
      message = ExceptionMessage.FILE_UPLOAD_FAILED;
    }
  }

  void cleanupFiles(req);

  if (!isOperationalError) logger.error(err);

  return createResponse(res, status, message, undefined, true);
};

export { notFoundErrorHandler, requestTimeoutHandler, appErrorHandler };
