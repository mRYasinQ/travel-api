import { eq } from 'drizzle-orm';

import db from '../configs/db.config';

import { PERMISSION_LIST } from '../common/constants/Permissions';
import getErrorMessage from '../common/utils/getErrorMessage';

import roleEntity from '../modules/role/role.entity';
import { type CreateUser, createUserSchema } from '../modules/user/user.schema';
import { createUser } from '../modules/user/user.service';

const ROLE_NAME = 'مدیر';

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
  console.log('Superuser creation script');

  try {
    const roleId = await craeteRole();

    const firstName = prompt('Enter first name (optional):') || null;
    const lastName = prompt('Enter last name (optional):') || null;

    let username = '';
    while (!username) {
      username = prompt('Enter username:') || '';
      if (!username) console.warn('username is required.');
    }

    let email = '';
    while (!email) {
      email = prompt('Enter email:') || '';
      if (!email) console.warn('email is required.');
    }

    let password = '';
    while (!password) {
      password = prompt('Enter password:') || '';
      if (!password) console.warn('password is required.');
    }

    const payload: CreateUser = {
      first_name: firstName,
      last_name: lastName,
      username,
      email,
      password,
      role_id: roleId,
    };
    const validatePayload = await createUserSchema.safeParseAsync(payload);
    if (!validatePayload.success) {
      console.error(validatePayload.error.issues[0].message);
      process.exit(1);
    }

    const newUser = validatePayload.data;

    await createUser({ ...newUser, is_email_verified: true });

    console.log('Superuser created successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Superuser creation failed, Error: ${getErrorMessage(error)}.`);
    process.exit(1);
  }
};

createSuperUser();
