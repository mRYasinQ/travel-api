import HttpStatusCode from '../constants/HttpStatusCode';

class AppeError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode?: HttpStatusCode, isOperational?: boolean) {
    super(message);

    this.statusCode = statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.isOperational = isOperational ?? true;

    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}

export default AppeError;
