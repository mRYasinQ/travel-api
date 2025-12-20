import type { RequestHandler } from 'express';

import CommonMessage from '../../common/constants/Message';
import createResponse from '../../common/helpers/createResponse';
import AppError from '../../common/utils/AppError';
import { hasPermissions } from '../../common/utils/permission';

import { toUserResponse } from './user.mapper';
import UserMessage from './user.message';
import type { CreateUser, UpdateMe, UpdateUser, UserParam, UserParamWithUsername } from './user.schema';
import { createUser, deleteUser, getUser, getUserByUsername, updateUser } from './user.service';

const getMeHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const user = await getUser(userId);

    return createResponse(res, 'OK', UserMessage.PROFILE_RETRIEVED, toUserResponse(user, true));
  } catch (error) {
    return next(error);
  }
};

const updateMeHandler: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new AppError(CommonMessage.AUTHENTICATION_REQUIRED, 'UNAUTHORIZED');

    const payload = req.validatedBody as UpdateMe;
    if (Object.keys(payload).length === 0) throw new AppError(CommonMessage.PAYLOAD_EMPTY, 'BAD_REQUEST');

    await updateUser(userId, payload);

    return createResponse(res, 'OK', UserMessage.PROFILE_UPDATED);
  } catch (error) {
    return next(error);
  }
};

const getUsersHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const getUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as UserParam;
    const permissions = req.permissions;

    const isOwner = req.user?.id === id;
    const hasShowUserPermission = hasPermissions(permissions, 'SHOW_USER');
    const hasAccess = isOwner || hasShowUserPermission;

    const user = await getUser(id);

    return createResponse(res, 'OK', UserMessage.USER_RETRIEVED, toUserResponse(user, hasAccess));
  } catch (error) {
    return next(error);
  }
};

const getUserByUsernameHandler: RequestHandler = async (req, res, next) => {
  try {
    const { username } = req.params as UserParamWithUsername;
    const permissions = req.permissions;

    const isOwner = req.user?.username === username;
    const hasShowUserPermission = hasPermissions(permissions, 'SHOW_USER');
    const hasAccess = isOwner || hasShowUserPermission;

    const user = await getUserByUsername(username);

    return createResponse(res, 'OK', UserMessage.USER_RETRIEVED, toUserResponse(user, hasAccess));
  } catch (error) {
    return next(error);
  }
};

const createUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const payload = req.validatedBody as CreateUser;

    await createUser(payload);

    return createResponse(res, 'CREATED', UserMessage.USER_CREATED);
  } catch (error) {
    return next(error);
  }
};

const updateUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as UserParam;

    const payload = req.validatedBody as UpdateUser;
    if (Object.keys(payload).length === 0) throw new AppError(CommonMessage.PAYLOAD_EMPTY, 'BAD_REQUEST');

    const userId = req.user?.id;
    if (userId === id) throw new AppError(UserMessage.CANNOT_UPDATE_SELF, 'CONFLICT');

    await updateUser(id, payload);

    return createResponse(res, 'OK', UserMessage.USER_UPDATED);
  } catch (error) {
    return next(error);
  }
};

const deleteUserHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as UserParam;

    const userId = req.user?.id;
    if (userId === id) throw new AppError(UserMessage.CANNOT_DELETE_SELF, 'CONFLICT');

    await deleteUser(id);

    return createResponse(res, 'OK', UserMessage.USER_DELETED);
  } catch (error) {
    return next(error);
  }
};

export {
  getMeHandler,
  updateMeHandler,
  getUsersHandler,
  getUserHandler,
  getUserByUsernameHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
};
