import { relations } from 'drizzle-orm';
import { boolean, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import sessionEntity from '../session/session.entity';

const userEntity = mysqlTable('user', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 30 }),
  lastName: varchar('last_name', { length: 30 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 40 }).notNull().unique(),
  password: varchar('password', { length: 200 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

const userRelations = relations(userEntity, ({ many }) => ({
  sessions: many(sessionEntity),
}));

export { userRelations };
export default userEntity;
