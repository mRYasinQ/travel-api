import permissionMapper from '../../common/utils/permissionMapper';

import roleEntity from './role.entity';

type RoleData = typeof roleEntity.$inferSelect & { user_count: number };

const toRoleResponse = ({ id, name, permissions, user_count, createdAt, updatedAt }: RoleData) => {
  return {
    id,
    name,
    user_count,
    permissions: permissionMapper(permissions),
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

const toRolesResponse = (roles: RoleData[]) => {
  return roles.map((role) => toRoleResponse(role));
};

export { toRoleResponse, toRolesResponse };
