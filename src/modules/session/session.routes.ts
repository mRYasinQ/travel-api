import { Router } from 'express';

import checkAuth from '../../middlewares/checkAuth.middleware';
import { validationBody, validationParams } from '../../middlewares/validation.middleware';

import {
  clearSessionsHandler,
  deleteSessionHandler,
  getSessionHandler,
  getSessionsHandler,
} from './session.controller';
import { clearSessionsSchema, sessionParamSchema } from './session.schema';

const sessionRouter = Router();

sessionRouter.use(checkAuth());

sessionRouter.get('/', getSessionsHandler);
sessionRouter.post('/clear', validationBody(clearSessionsSchema), clearSessionsHandler);

sessionRouter.get('/:id', validationParams(sessionParamSchema), getSessionHandler);
sessionRouter.delete('/:id', validationParams(sessionParamSchema), deleteSessionHandler);

export default sessionRouter;
