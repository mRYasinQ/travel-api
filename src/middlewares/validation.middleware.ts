import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

import HttpStatusCode from '../common/constants/HttpStatusCode';
import AppeError from '../common/utils/AppError';

type DataSource = 'body' | 'query' | 'params';

const createValidator = (schema: ZodType, source: DataSource): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const data = req[source];

      const result = await schema.safeParseAsync(data);
      if (result.success) {
        req[source] = result.data;
      } else {
        const firstErrorMessage = result.error.issues[0].message;
        throw new AppeError(firstErrorMessage, HttpStatusCode.BAD_REQUEST);
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
