import type { RequestHandler } from 'express';

import PERMISSIONS from '../../common/constants/Permissions';
import createResponse from '../../common/helpers/createResponse';

import RoleMessage from './role.message';

const getPermissiosHandler: RequestHandler = async (_req, res, next) => {
  try {
    return createResponse(res, 'OK', RoleMessage.PERMISSIONS_RETRIEVED, PERMISSIONS);
  } catch (error) {
    return next(error);
  }
};

const getRolesHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const getRoleHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const createRoleHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const updateRoleHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

const deleteRoleHandler: RequestHandler = async (_req, _res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

export {
  getPermissiosHandler,
  getRolesHandler,
  getRoleHandler,
  createRoleHandler,
  updateRoleHandler,
  deleteRoleHandler,
};
