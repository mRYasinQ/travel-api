import { relations } from 'drizzle-orm';
import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import userEntity from '../user/user.entity';

const sessionEntity = mysqlTable('session', {
  id: int('id').primaryKey().autoincrement(),
  browser: varchar('browser', { length: 30 }).notNull(),
  os: varchar('device', { length: 30 }).notNull(),
  userId: int('user_id')
    .notNull()
    .references(() => userEntity.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  token: varchar('token', { length: 80 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expireAt: timestamp('expire_at').notNull(),
});

const sessionRelations = relations(sessionEntity, ({ one }) => ({
  user: one(userEntity, {
    fields: [sessionEntity.userId],
    references: [userEntity.id],
  }),
}));

export { sessionRelations };
export default sessionEntity;
