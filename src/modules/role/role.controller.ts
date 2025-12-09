import type { RequestHandler } from 'express';

import CommonMessage from '../../common/constants/Message';
import PERMISSIONS from '../../common/constants/Permissions';
import createResponse from '../../common/helpers/createResponse';
import AppError from '../../common/utils/AppError';

import { toRoleResponse, toRolesResponse } from './role.mapper';
import RoleMessage from './role.message';
import type { CreateRole, RoleParam, RolesQuery, UpdateRole } from './role.schema';
import { createRole, deleteRole, getRole, getRoles, updateRole } from './role.service';

const getPermissiosHandler: RequestHandler = async (_req, res, next) => {
  try {
    return createResponse(res, 'OK', RoleMessage.PERMISSIONS_RETRIEVED, PERMISSIONS);
  } catch (error) {
    return next(error);
  }
};

const getRolesHandler: RequestHandler = async (req, res, next) => {
  try {
    const filters = req.validatedQuery as RolesQuery;

    const roles = await getRoles(filters);

    return createResponse(res, 'OK', RoleMessage.ROLES_RETRIEVED, toRolesResponse(roles));
  } catch (error) {
    return next(error);
  }
};

const getRoleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as RoleParam;

    const role = await getRole(id);

    return createResponse(res, 'OK', RoleMessage.ROLE_RETRIEVED, toRoleResponse(role));
  } catch (error) {
    return next(error);
  }
};

const createRoleHandler: RequestHandler = async (req, res, next) => {
  try {
    const payload = req.validatedBody as CreateRole;

    await createRole(payload);

    return createResponse(res, 'CREATED', RoleMessage.ROLE_CREATED);
  } catch (error) {
    return next(error);
  }
};

const updateRoleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as RoleParam;
    const payload = req.validatedBody as UpdateRole;

    if (Object.keys(payload).length === 0) throw new AppError(CommonMessage.PAYLOAD_EMPTY, 'BAD_REQUEST');

    await updateRole(id, payload);

    return createResponse(res, 'OK', RoleMessage.ROLE_UPDATED);
  } catch (error) {
    return next(error);
  }
};

const deleteRoleHandler: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.validatedParams as RoleParam;

    await deleteRole(id);

    return createResponse(res, 'OK', RoleMessage.ROLE_DELETED);
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
