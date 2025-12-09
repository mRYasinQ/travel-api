const PERMISSIONS = [
  {
    label: 'Show Role',
    value: 'SHOW_ROLE',
  },
  {
    label: 'Create Role',
    value: 'CREATE_ROLE',
  },
  {
    label: 'Update Role',
    value: 'UPDATE_ROLE',
  },
  {
    label: 'Delete Role',
    value: 'DELETE_ROLE',
  },
  {
    label: 'Show Activity',
    value: 'SHOW_ACTIVITY',
  },
  {
    label: 'Create Activity',
    value: 'CREATE_ACTIVITY',
  },
  {
    label: 'Update Activity',
    value: 'UPDATE_ACTIVITY',
  },
  {
    label: 'Delete Activity',
    value: 'DELETE_ACTIVITY',
  },
] as const;

const PERMISSION_LIST = PERMISSIONS.map((p) => p.value);

type PermissionsType = typeof PERMISSIONS;
type PermissionItemType = PermissionsType[number];
type Permission = PermissionItemType['value'];

export { PERMISSION_LIST, Permission };
export default PERMISSIONS;
