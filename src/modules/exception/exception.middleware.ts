import type { ErrorRequestHandler, RequestHandler } from 'express';

import logger from '../../configs/logger.config';

import HttpStatusCode from '../../common/constants/HttpStatusCode';
import AppeError from '../../common/utils/AppError';
import createResponse from '../../common/utils/createResponse';
import formatMessage from '../../common/utils/formatMessage';

import ExceptionMessage from './exception.message';

const notFoundErrorHandler: RequestHandler = (req, res) => {
  return createResponse(
    res,
    HttpStatusCode.NOT_FOUND,
    formatMessage(ExceptionMessage.NOT_FOUND, { method: req.method, route: req.originalUrl }),
    undefined,
    true,
  );
};

const appErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  let message: string = ExceptionMessage.INTERNAL_SERVER;
  let isOperationalError: boolean = false;

  if (err instanceof AppeError) {
    if (err.isOperational) {
      statusCode = err.statusCode;
      message = err.message;
      isOperationalError = true;
    }
  }

  if (!isOperationalError) logger.error(err);

  return createResponse(res, statusCode, message, undefined, true);
};

export { notFoundErrorHandler, appErrorHandler };
