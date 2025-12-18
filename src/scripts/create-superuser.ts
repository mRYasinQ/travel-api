import { eq, or } from 'drizzle-orm';

import db from '../configs/db.config';
import logger from '../configs/logger.config';

import { PERMISSION_LIST } from '../common/constants/Permissions';
import { hashPassword } from '../common/helpers/password';
import getErrorMessage from '../common/utils/getErrorMessage';

import roleEntity from '../modules/role/role.entity';
import userEntity from '../modules/user/user.entity';

const ROLE_NAME = 'Founder';

const craeteRole = async () => {
  let roleId: number;

  const role = await db.query.role.findFirst({
    where: eq(roleEntity.name, ROLE_NAME),
    columns: { id: true },
  });

  if (role) {
    roleId = role.id;
  } else {
    const [{ insertId }] = await db.insert(roleEntity).values({
      name: ROLE_NAME,
      permissions: PERMISSION_LIST,
    });

    roleId = insertId;
  }

  return roleId;
};

const createSuperUser = async () => {
  logger.info('Superuser creation script');

  try {
    const roleId = await craeteRole();

    const firstName = prompt('Enter first name (optional):') || undefined;
    const lastName = prompt('Enter last name (optional):') || undefined;
    const username = prompt('Enter username (optional):') || undefined;

    let email = '';
    while (!email) {
      email = prompt('Enter email:') || '';
      if (!email) console.warn('Email is required.');
    }

    let password = '';
    while (!password) {
      password = prompt('Enter password:') || '';
      if (!password) console.warn('Password is required.');
    }

    const conditions = [eq(userEntity.email, email)];
    if (username) conditions.push(eq(userEntity.username, username));

    const userExist = await db.query.user.findFirst({
      where: or(...conditions),
      columns: { id: true },
    });

    if (userExist) {
      logger.error(`User with email ${email} or username ${username} already exists.`);
      process.exit(1);
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(userEntity).values({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
      roleId,
      isEmailVerified: true,
      isActive: true,
    });

    logger.info('Superuser created successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Superuser creation failed, Error: ${getErrorMessage(error)}.`);
    process.exit(1);
  }
};

createSuperUser();
