import type { Request, Response } from 'express';

import HttpStatusCode from '../../common/constants/HttpStatusCode';
import createResponse from '../../common/utils/createResponse';
import formatMessage from '../../common/utils/formatMessage';

import ExceptionMessage from './exception.message';

function notFoundErrorHandler(req: Request, res: Response) {
  return createResponse(
    res,
    HttpStatusCode.NOT_FOUND,
    formatMessage(ExceptionMessage.NOT_FOUND, { method: req.method, route: req.originalUrl }),
    undefined,
    true,
  );
}

export { notFoundErrorHandler };
