import type { Response } from 'express';

import type { ResponseType } from '../../types/response';

import HttpStatusCode, { type HttpStatusCodeKeys } from '../constants/HttpStatusCode';

const createResponse = <T>(
  res: Response<ResponseType<T>>,
  status: HttpStatusCodeKeys,
  message: string,
  data?: T,
  error: boolean = false,
) => {
  const statusCode = HttpStatusCode[status];

  return res.status(statusCode).json({
    status_code: statusCode,
    data,
    message: error ? undefined : message,
    error: error ? message : undefined,
  });
};

export default createResponse;
