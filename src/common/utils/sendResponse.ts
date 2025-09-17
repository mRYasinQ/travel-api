import type { Response } from 'express';

import type { SuccessResponse, ErrorResponse, SuccessData, ErrorData } from '../../types/response';

import type HttpStatusCode from '../constants/HttpStatusCode';

const successResponse = <T>(res: Response<SuccessResponse<T>>, statusCode: HttpStatusCode, data: SuccessData<T>) => {
  return res.status(statusCode).json({
    status_code: statusCode,
    data: data?.data,
    message: data.message,
  });
};

const errorResponse = (res: Response<ErrorResponse>, statusCode: HttpStatusCode, error: ErrorData) => {
  return res.status(statusCode).json({
    status_code: statusCode,
    error,
  });
};

export { successResponse, errorResponse };
