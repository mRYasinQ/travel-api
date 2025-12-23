import { and, count, eq, getTableColumns, like, or, SQL } from 'drizzle-orm';

import db from '../../configs/db.config';

import CommonMessage from '../../common/constants/Message';
import { hashPassword } from '../../common/helpers/password';
import AppError from '../../common/utils/AppError';
import { getOrderByConfig } from '../../common/utils/filter';
import { createPaginationService, withPagination } from '../../common/utils/pagination';

import roleEntity from '../role/role.entity';
import RoleMessage from '../role/role.message';
import { checkRoleExist } from '../role/role.service';
import sessionEntity from '../session/session.entity';

import { PUBLIC_ORDER_FIELDS, SENSITIVE_ORDER_FIELDS } from './user.constants';
import userEntity from './user.entity';
import UserMessage from './user.message';
import type { CreateUser, UpdateUser, UsersQuery } from './user.schema';

const getUserOrderMap = (hasPermission: boolean) => {
  return {
    ...PUBLIC_ORDER_FIELDS,
    ...(hasPermission ? SENSITIVE_ORDER_FIELDS : {}),
  };
};

const checkUserExistByEmail = async (email: string) => {
  const user = await db.query.user.findFirst({ where: eq(userEntity.email, email), columns: { id: true } });
  return Boolean(user);
};

const checkUserExistByUsername = async (username: string) => {
  const user = await db.query.user.findFirst({ where: eq(userEntity.username, username), columns: { id: true } });
  return user ? true : false;
};

const getUsers = async (filterQuery: UsersQuery, hasPermission: boolean) => {
  const { page, limit, order_by, search } = filterQuery;

  const filters: SQL[] = [];
  const orderExpressions = getOrderByConfig(order_by, getUserOrderMap(hasPermission));

  if (search) {
    const searchConditions: SQL[] = [
      like(userEntity.firstName, `%${search}%`),
      like(userEntity.lastName, `%${search}%`),
      like(userEntity.username, `%${search}%`),
    ];

    if (hasPermission) searchConditions.push(like(userEntity.email, `%${search}%`));

    filters.push(or(...searchConditions)!);
  }

  const whereExpressions = filters.length > 0 ? and(...filters) : undefined;

  const query = db
    .select({
      ...getTableColumns(userEntity),
      role: {
        id: roleEntity.id,
        name: roleEntity.name,
        permissions: roleEntity.permissions,
      },
    })
    .from(userEntity)
    .leftJoin(roleEntity, eq(userEntity.roleId, roleEntity.id))
    .where(whereExpressions)
    .orderBy(...orderExpressions)
    .$withCache();
  const dynamicQuery = query.$dynamic();

  const countQuery = db.select({ count: count() }).from(userEntity).where(whereExpressions).$withCache();
  const dataQuery = withPagination(dynamicQuery, page, limit);

  const [[{ count: total }], data] = await Promise.all([countQuery, dataQuery]);

  const pagination = createPaginationService(page, limit, total);

  return {
    data,
    pagination,
  };
};

const getUser = async (id: number) => {
  const user = await db.query.user.findFirst({
    where: eq(userEntity.id, id),
    columns: { password: false },
    with: {
      role: { columns: { createdAt: false, updatedAt: false } },
    },
  });
  if (!user) throw new AppError(UserMessage.NOT_FOUND, 'NOT_FOUND');

  return user;
};

const getUserByUsername = async (username: string) => {
  const user = await db.query.user.findFirst({
    where: eq(userEntity.username, username),
    columns: { password: false },
    with: {
      role: { columns: { createdAt: false, updatedAt: false } },
    },
  });
  if (!user) throw new AppError(UserMessage.NOT_FOUND, 'NOT_FOUND');

  return user;
};

const createUser = async (payload: CreateUser) => {
  const { first_name, last_name, email, username, role_id, is_active, is_email_verified } = payload;
  let { password } = payload;

  const checkExistTask: Promise<unknown>[] = [checkUserExistByEmail(email), checkUserExistByUsername(username)];
  if (role_id) checkExistTask.push(checkRoleExist(role_id));
  const [isExistEmail, isExistUsername, isExistRole] = await Promise.all(checkExistTask);

  if (isExistEmail) throw new AppError(UserMessage.EMAIL_EXIST, 'CONFLICT');
  if (isExistUsername) throw new AppError(UserMessage.USERNAME_EXIST, 'CONFLICT');
  if (role_id && !isExistRole) throw new AppError(RoleMessage.NOT_FOUND, 'NOT_FOUND');

  password = await hashPassword(password);

  await db.insert(userEntity).values({
    firstName: first_name,
    lastName: last_name,
    email,
    username,
    password,
    roleId: role_id,
    isActive: is_active,
    isEmailVerified: is_email_verified,
  });

  return;
};

const updateUser = async (id: number, payload: UpdateUser) => {
  const user = await db.query.user.findFirst({
    where: eq(userEntity.id, id),
    columns: { email: true, username: true, roleId: true },
  });
  if (!user) throw new AppError(UserMessage.NOT_FOUND, 'NOT_FOUND');

  const { first_name, last_name, email, username, is_active, role_id } = payload;
  let { is_email_verified, password } = payload;

  const checkEmailCondition = email && user.email !== email;
  const checkUsernameCondition = username && user.username !== username;
  const checkRoleCondition = role_id && user.roleId !== role_id;

  const [isExistEmail, isExistUsername, isExistRole] = await Promise.all([
    checkEmailCondition ? checkUserExistByEmail(email) : Promise.resolve(false),
    checkUsernameCondition ? checkUserExistByUsername(username) : Promise.resolve(false),
    checkRoleCondition ? checkRoleExist(role_id) : Promise.resolve(true),
  ]);

  if (isExistEmail) throw new AppError(UserMessage.EMAIL_EXIST, 'CONFLICT');
  if (isExistUsername) throw new AppError(UserMessage.USERNAME_EXIST, 'CONFLICT');
  if (checkRoleCondition && !isExistRole) throw new AppError(RoleMessage.NOT_FOUND, 'NOT_FOUND');

  if (checkEmailCondition && is_email_verified === undefined) is_email_verified = false;

  if (password) password = await hashPassword(password);

  await db.transaction(async (tx) => {
    if (is_active === false) await tx.delete(sessionEntity).where(eq(sessionEntity.userId, id));

    const [{ affectedRows }] = await tx
      .update(userEntity)
      .set({
        firstName: first_name,
        lastName: last_name,
        email,
        username,
        password,
        isActive: is_active,
        isEmailVerified: is_email_verified,
        roleId: role_id,
      })
      .where(eq(userEntity.id, id));
    if (affectedRows === 0) throw new AppError(CommonMessage.NO_CHANGE_REQUIRED, 'OK');
  });

  return;
};

const deleteUser = async (id: number) => {
  const [{ affectedRows }] = await db.delete(userEntity).where(eq(userEntity.id, id));
  if (affectedRows === 0) throw new AppError(UserMessage.NOT_FOUND, 'NOT_FOUND');

  return;
};

export { getUsers, getUser, getUserByUsername, createUser, updateUser, deleteUser };
