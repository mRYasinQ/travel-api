import { relations } from 'drizzle-orm';
import { int, json, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

import type { Permissions } from '../../common/constants/Permissions';

import userEntity from '../user/user.entity';

const roleEntity = mysqlTable('role', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 150 }).unique().notNull(),
  permissions: json('permissions').$type<Permissions[]>().default([]).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

const roleRelations = relations(roleEntity, ({ many }) => ({
  users: many(userEntity),
}));

export { roleRelations };
export default roleEntity;
