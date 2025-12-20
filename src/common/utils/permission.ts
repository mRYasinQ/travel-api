import PERMISSIONS, { type Permission } from '../constants/Permissions';

const permissionMapper = (permissionKeys: Permission[]) => {
  return PERMISSIONS.filter(({ value }) => permissionKeys.includes(value));
};

const hasPermissions = (userPermissions: Permission[], ...requiredPermissions: Permission[]) => {
  const hasAllPermissions = requiredPermissions.every((permission) => userPermissions.includes(permission));
  return hasAllPermissions;
};

export { permissionMapper, hasPermissions };
