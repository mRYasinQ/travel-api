import type { Response } from 'express';

import type { ResponseType } from '../../types/response';

import type HttpStatusCode from '../constants/HttpStatusCode';

const createResponse = <T>(
  res: Response<ResponseType<T>>,
  statusCode: HttpStatusCode,
  message: string,
  data?: T,
  error: boolean = false,
) => {
  return res.status(statusCode).json({
    status_code: statusCode,
    data,
    message: error ? undefined : message,
    error: error ? message : undefined,
  });
};

export default createResponse;
