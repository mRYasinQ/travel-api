import PERMISSIONS, { type Permission } from '../constants/Permissions';

const permissionMapper = (permissionKeys: Permission[]) => {
  return PERMISSIONS.filter(({ value }) => permissionKeys.includes(value));
};

export default permissionMapper;
