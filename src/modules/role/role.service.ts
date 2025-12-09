import { count, eq } from 'drizzle-orm';

import db from '../../configs/db.config';

import CommonMessage from '../../common/constants/Message';
import AppError from '../../common/utils/AppError';
import { getOrderByConfig } from '../../common/utils/filter';

import userEntity from '../user/user.entity';

import { ROLE_ORDER_MAP } from './role.constants';
import roleEntity from './role.entity';
import RoleMessage from './role.message';
import type { CreateRole, RolesQuery, UpdateRole } from './role.schema';

const checkExistRoleByName = async (name: string) => {
  const role = await db.query.role.findFirst({ where: eq(roleEntity.name, name), columns: { id: true } });
  return role ? true : false;
};

const getRoles = async ({ order_by }: RolesQuery) => {
  const orderExpressions = getOrderByConfig(order_by, ROLE_ORDER_MAP);

  const roles = await db
    .select({
      id: roleEntity.id,
      name: roleEntity.name,
      permissions: roleEntity.permissions,
      createdAt: roleEntity.createdAt,
      updatedAt: roleEntity.updatedAt,
      user_count: count(userEntity.id).as('user_count'),
    })
    .from(roleEntity)
    .leftJoin(userEntity, eq(roleEntity.id, userEntity.roleId))
    .groupBy(roleEntity.id)
    .orderBy(...orderExpressions)
    .$withCache();

  return roles;
};

const getRole = async (id: number) => {
  const result = await db
    .select({
      id: roleEntity.id,
      name: roleEntity.name,
      permissions: roleEntity.permissions,
      createdAt: roleEntity.createdAt,
      updatedAt: roleEntity.updatedAt,
      user_count: count(userEntity.id),
    })
    .from(roleEntity)
    .leftJoin(userEntity, eq(roleEntity.id, userEntity.roleId))
    .where(eq(roleEntity.id, id))
    .groupBy(roleEntity.id)
    .limit(1)
    .$withCache();

  const role = result[0];
  if (!role) throw new AppError(RoleMessage.NOT_FOUND, 'NOT_FOUND');

  return role;
};

const createRole = async (payload: CreateRole) => {
  const isExist = await checkExistRoleByName(payload.name);
  if (isExist) throw new AppError(RoleMessage.ROLE_EXIST, 'CONFLICT');

  await db.insert(roleEntity).values(payload);

  return;
};

const updateRole = async (id: number, payload: UpdateRole) => {
  const role = await db.query.role.findFirst({ where: eq(roleEntity.id, id), columns: { name: true } });
  if (!role) throw new AppError(RoleMessage.NOT_FOUND, 'NOT_FOUND');

  if (payload.name && role.name !== payload.name) {
    const isExist = await checkExistRoleByName(payload.name);
    if (isExist) throw new AppError(RoleMessage.ROLE_EXIST, 'CONFLICT');
  }

  const [{ affectedRows }] = await db.update(roleEntity).set(payload).where(eq(roleEntity.id, id));
  if (affectedRows === 0) throw new AppError(CommonMessage.NO_CHANGE_REQUIRED, 'OK');

  return;
};

const deleteRole = async (id: number) => {
  const [{ affectedRows }] = await db.delete(roleEntity).where(eq(roleEntity.id, id));
  if (affectedRows === 0) throw new AppError(RoleMessage.NOT_FOUND, 'NOT_FOUND');

  return;
};

export { getRoles, getRole, createRole, updateRole, deleteRole };
