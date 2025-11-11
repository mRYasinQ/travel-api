import { Router } from 'express';

import checkAuth from '../../middlewares/checkAuth.middleware';
import { validationParams } from '../../middlewares/validation.middleware';

import {
  clearSessionsHandler,
  deleteSessionHandler,
  getSessionHandler,
  getSessionsHandler,
} from './session.controller';
import { sessionParamSchema } from './session.schema';

const sessionRouter = Router();

sessionRouter.use(checkAuth());

sessionRouter.get('/', getSessionsHandler);
sessionRouter.delete('/clear', clearSessionsHandler);

sessionRouter.get('/:id', validationParams(sessionParamSchema), getSessionHandler);
sessionRouter.delete('/:id', validationParams(sessionParamSchema), deleteSessionHandler);

export default sessionRouter;
