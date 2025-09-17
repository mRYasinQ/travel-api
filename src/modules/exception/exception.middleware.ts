import type { Request, Response } from 'express';

import HttpStatusCode from '../../common/constants/HttpStatusCode';
import formatMessage from '../../common/utils/formatMessage';
import { errorResponse } from '../../common/utils/sendResponse';

import ExceptionMessage from './exception.message';

function notFoundErrorHandler(req: Request, res: Response) {
  return errorResponse(res, HttpStatusCode.NOT_FOUND, {
    type: 'NotFoundException',
    message: formatMessage(ExceptionMessage.NOT_FOUND, { method: req.method, route: req.originalUrl }),
  });
}

export { notFoundErrorHandler };
