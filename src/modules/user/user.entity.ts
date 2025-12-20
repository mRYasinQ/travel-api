import { relations } from 'drizzle-orm';
import { boolean, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import roleEntity from '../role/role.entity';
import sessionEntity from '../session/session.entity';

const userEntity = mysqlTable('user', {
  id: int('id').primaryKey().autoincrement(),
  firstName: varchar('first_name', { length: 30 }),
  lastName: varchar('last_name', { length: 30 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 40 }).notNull().unique(),
  password: varchar('password', { length: 200 }).notNull(),
  roleId: int('role_id').references(() => roleEntity.id, { onUpdate: 'cascade', onDelete: 'set null' }),
  isActive: boolean('is_active').notNull().default(true),
  isEmailVerified: boolean('is_email_verified').notNull().default(false),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

const userRelations = relations(userEntity, ({ one, many }) => ({
  sessions: many(sessionEntity),
  role: one(roleEntity, {
    fields: [userEntity.roleId],
    references: [roleEntity.id],
  }),
}));

export { userRelations };
export default userEntity;
