import { sql } from 'drizzle-orm';

import roleEntity from './role.entity';

const ROLE_ORDER_MAP = {
  id: roleEntity.id,
  name: roleEntity.name,
  created_at: roleEntity.createdAt,
  updated_at: roleEntity.updatedAt,
  user_count: sql`user_count`,
};

export { ROLE_ORDER_MAP };
