const PERMISSIONS = [
  'SHOW_ROLE',
  'CREATE_ROLE',
  'UPDATE_ROLE',
  'DELETE_ROLE',
  'CREATE_ACTIVITY',
  'UPDATE_ACTIVITY',
  'DELETE_ACTIVITY',
] as const;

type PermissionsType = typeof PERMISSIONS;
type Permissions = PermissionsType[number];

export { Permissions };
export default PERMISSIONS;
