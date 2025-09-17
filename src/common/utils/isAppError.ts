import AppeError from './AppError';

const isAppError = (error: unknown): error is AppeError => error instanceof AppeError;

export default isAppError;
