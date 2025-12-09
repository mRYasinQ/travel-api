const PERMISSIONS = [
  'SHOW_ROLE',
  'CREATE_ROLE',
  'UPDATE_ROLE',
  'DELETE_ROLE',
  'CREATE_ACTIVITY',
  'UPDATE_ACTIVITY',
  'DELETE_ACTIVITY',
] as const;

type Permissions = typeof PERMISSIONS;
type Permission = Permissions[number];

export { Permissions, Permission };
export default PERMISSIONS;
