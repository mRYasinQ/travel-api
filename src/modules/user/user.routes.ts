import { Router } from 'express';

import { checkAuth, checkPermissions } from '../../middlewares/auth.middleware';
import { validationBody, validationParams } from '../../middlewares/validation.middleware';

import {
  createUserHandler,
  deleteUserHandler,
  getMeHandler,
  getUserByUsernameHandler,
  getUserHandler,
  getUsersHandler,
  updateMeHandler,
  updateUserHandler,
} from './user.controller';
import {
  createUserSchema,
  updateMeSchema,
  updateUserSchema,
  userParamSchema,
  userParamWithUsernameSchema,
} from './user.schema';

const userRouter = Router();

userRouter.use(checkAuth(true));

userRouter.get('/', getUsersHandler);
userRouter.get('/:id', validationParams(userParamSchema), getUserHandler);
userRouter.get('/by-username/:username', validationParams(userParamWithUsernameSchema), getUserByUsernameHandler);

userRouter.use(checkAuth());

userRouter.get('/me', getMeHandler);
userRouter.patch('/me', checkPermissions('UPDATE_PROFILE'), validationBody(updateMeSchema), updateMeHandler);

userRouter.post('/', checkPermissions('CREATE_USER', 'SHOW_ROLE'), validationBody(createUserSchema), createUserHandler);

userRouter.patch(
  '/:id',
  checkPermissions('UPDATE_USER', 'SHOW_ROLE', 'UPDATE_ROLE'),
  validationParams(userParamSchema),
  validationBody(updateUserSchema),
  updateUserHandler,
);
userRouter.delete('/:id', checkPermissions('DELETE_USER'), validationParams(userParamSchema), deleteUserHandler);

export default userRouter;
