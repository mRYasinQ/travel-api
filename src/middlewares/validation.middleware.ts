import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import AppError from '../common/utils/AppError';

const validatedDest = {
  body: 'validatedBody',
  query: 'validatedQuery',
  params: 'validatedParams',
} as const;

const createValidator = (schema: ZodType, source: keyof typeof validatedDest): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const data = req[source];

      const result = await schema.safeParseAsync(data);
      if (result.success) {
        const destination = validatedDest[source];
        req[destination] = result.data;
      } else {
        const firstErrorMessage = result.error.issues[0].message;
        throw new AppError(firstErrorMessage, 'BAD_REQUEST');
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

const validationBody = (schema: ZodType) => createValidator(schema, 'body');
const validationQuery = (schema: ZodType) => createValidator(schema, 'query');
const validationParams = (schema: ZodType) => createValidator(schema, 'params');

export { validationBody, validationQuery, validationParams };
