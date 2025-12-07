import type { Response } from 'express';

import type { ResponseType } from '../../types/response';

import HttpStatusCode, { type HttpStatusCodeKeys } from '../constants/HttpStatusCode';

const createResponse = <T, E>(
  res: Response<ResponseType<T>>,
  status: HttpStatusCodeKeys,
  message: string,
  data?: T,
  error: boolean = false,
  extraData?: E,
) => {
  const statusCode = HttpStatusCode[status];

  return res.status(statusCode).json({
    status_code: statusCode,
    data,
    message: error ? undefined : message,
    error: error ? message : undefined,
    ...extraData,
  });
};

export default createResponse;
