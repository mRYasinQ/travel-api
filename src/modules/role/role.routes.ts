import { Router } from 'express';

import checkAuth from '../../middlewares/checkAuth.middleware';
import { validationBody, validationParams, validationQuery } from '../../middlewares/validation.middleware';

import {
  createRoleHandler,
  deleteRoleHandler,
  getPermissiosHandler,
  getRoleHandler,
  getRolesHandler,
  updateRoleHandler,
} from './role.controller';
import { createRoleSchema, roleParamSchema, rolesQuerySchema, updateRoleSchema } from './role.schema';

const roleRouter = Router();

roleRouter.use(checkAuth());

roleRouter.get('/', validationQuery(rolesQuerySchema), getRolesHandler);
roleRouter.post('/', validationBody(createRoleSchema), createRoleHandler);

roleRouter.get('/permissions', getPermissiosHandler);

roleRouter.get('/:id', validationParams(roleParamSchema), getRoleHandler);
roleRouter.patch('/:id', validationParams(roleParamSchema), validationBody(updateRoleSchema), updateRoleHandler);
roleRouter.delete('/:id', validationParams(roleParamSchema), deleteRoleHandler);

export default roleRouter;
