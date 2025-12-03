import { int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

const activityEntity = mysqlTable('activity', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 200 }).notNull(),
  image: varchar('image', { length: 150 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export default activityEntity;
