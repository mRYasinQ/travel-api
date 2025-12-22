import userEntity from './user.entity';

const PUBLIC_ORDER_FIELDS = {
  id: userEntity.id,
  first_name: userEntity.firstName,
  last_name: userEntity.lastName,
  username: userEntity.username,
  role_id: userEntity.roleId,
  is_active: userEntity.isActive,
  joined_at: userEntity.joinedAt,
};

const SENSITIVE_ORDER_FIELDS = {
  email: userEntity.email,
  is_email_verified: userEntity.isEmailVerified,
};

export { PUBLIC_ORDER_FIELDS, SENSITIVE_ORDER_FIELDS };
