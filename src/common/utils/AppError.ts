import type { HttpStatusCodeKeys } from '../constants/HttpStatusCode';

class AppeError extends Error {
  status: HttpStatusCodeKeys;
  isOperational: boolean;

  constructor(message: string, status: HttpStatusCodeKeys, isOperational?: boolean) {
    super(message);

    this.status = status;
    this.isOperational = isOperational ?? true;

    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}

export default AppeError;
