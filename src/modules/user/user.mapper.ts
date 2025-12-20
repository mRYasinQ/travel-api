import roleEntity from '../role/role.entity';

import userEntity from './user.entity';

type RoleData = Nullable<Pick<typeof roleEntity.$inferSelect, 'id' | 'name' | 'permissions'>>;
type UserData = Omit<typeof userEntity.$inferSelect, 'password'> & { role: RoleData };

const toUserResponse = (
  { id, firstName, lastName, email, username, roleId, role, isActive, isEmailVerified, joinedAt, updatedAt }: UserData,
  hasPermission: boolean,
) => {
  return {
    id,
    first_name: firstName,
    last_name: lastName,
    email: hasPermission ? email : undefined,
    username,
    role_id: roleId,
    role: {
      ...role,
      permissions: hasPermission ? role?.permissions : undefined,
    },
    is_active: isActive,
    is_email_verified: hasPermission ? isEmailVerified : undefined,
    joined_at: joinedAt,
    updated_at: updatedAt,
  };
};

export { toUserResponse };
