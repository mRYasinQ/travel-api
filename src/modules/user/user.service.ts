import { eq } from 'drizzle-orm';

import db from '../../configs/db.config';

import userEntity from './user.entity';

type NewUser = typeof userEntity.$inferInsert;

const getUserByEmail = async (email: string) => {
  const user = await db.query.user.findFirst({
    where: eq(userEntity.email, email),
  });

  return user;
};

const createUser = async (newUser: NewUser) => {
  const user = await getUserByEmail(newUser.email);
  if (user) return false;

  await db.insert(userEntity).values(newUser);

  return true;
};

export { getUserByEmail, createUser };
