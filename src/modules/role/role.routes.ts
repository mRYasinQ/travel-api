import { Router } from 'express';

import { checkAuth, checkPermissions } from '../../middlewares/auth.middleware';
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

roleRouter.get('/', checkPermissions('SHOW_ROLE'), validationQuery(rolesQuerySchema), getRolesHandler);
roleRouter.post('/', checkPermissions('CREATE_ROLE'), validationBody(createRoleSchema), createRoleHandler);

roleRouter.get('/permissions', checkPermissions('SHOW_ROLE'), getPermissiosHandler);

roleRouter.get('/:id', checkPermissions('SHOW_ROLE'), validationParams(roleParamSchema), getRoleHandler);
roleRouter.patch(
  '/:id',
  checkPermissions('UPDATE_ROLE'),
  validationParams(roleParamSchema),
  validationBody(updateRoleSchema),
  updateRoleHandler,
);
roleRouter.delete('/:id', checkPermissions('DELETE_ROLE'), validationParams(roleParamSchema), deleteRoleHandler);

export default roleRouter;
