import { Router } from 'express';

import { checkAuth, checkPermissions } from '../../middlewares/auth.middleware';
import { validationBody, validationParams, validationQuery } from '../../middlewares/validation.middleware';

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
  usersQuerySchema,
} from './user.schema';

const userRouter = Router();

const requireAuth = checkAuth();
const optionalAuth = checkAuth(true);

userRouter.get('/me', requireAuth, getMeHandler);
userRouter.patch(
  '/me',
  requireAuth,
  checkPermissions('UPDATE_PROFILE'),
  validationBody(updateMeSchema),
  updateMeHandler,
);

userRouter.post(
  '/',
  requireAuth,
  checkPermissions('CREATE_USER', 'SHOW_ROLE'),
  validationBody(createUserSchema),
  createUserHandler,
);

userRouter.patch(
  '/:id',
  requireAuth,
  checkPermissions('UPDATE_USER', 'SHOW_ROLE', 'UPDATE_ROLE'),
  validationParams(userParamSchema),
  validationBody(updateUserSchema),
  updateUserHandler,
);
userRouter.delete(
  '/:id',
  requireAuth,
  checkPermissions('DELETE_USER'),
  validationParams(userParamSchema),
  deleteUserHandler,
);

userRouter.get('/', optionalAuth, validationQuery(usersQuerySchema), getUsersHandler);

userRouter.get('/:id', optionalAuth, validationParams(userParamSchema), getUserHandler);
userRouter.get(
  '/by-username/:username',
  optionalAuth,
  validationParams(userParamWithUsernameSchema),
  getUserByUsernameHandler,
);

export default userRouter;
