import { Router } from 'express';

import checkAuth from '../../middlewares/checkAuth.middleware';

import {
  createRoleHandler,
  deleteRoleHandler,
  getPermissiosHandler,
  getRoleHandler,
  getRolesHandler,
  updateRoleHandler,
} from './role.controller';

const roleRouter = Router();

roleRouter.use(checkAuth());

roleRouter.get('/', getRolesHandler);
roleRouter.post('/', createRoleHandler);

roleRouter.get('/permissions', getPermissiosHandler);

roleRouter.get('/:id', getRoleHandler);
roleRouter.patch('/:id', updateRoleHandler);
roleRouter.delete('/:id', deleteRoleHandler);

export default roleRouter;
