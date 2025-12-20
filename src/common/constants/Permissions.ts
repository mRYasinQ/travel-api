const PERMISSIONS = [
  {
    label: 'نمایش نقش',
    value: 'SHOW_ROLE',
  },
  {
    label: 'ایجاد نقش',
    value: 'CREATE_ROLE',
  },
  {
    label: 'بروزرسانی نقش',
    value: 'UPDATE_ROLE',
  },
  {
    label: 'حذف نقش',
    value: 'DELETE_ROLE',
  },
  {
    label: 'نمایش فعالیت',
    value: 'SHOW_ACTIVITY',
  },
  {
    label: 'ایجاد فعالیت',
    value: 'CREATE_ACTIVITY',
  },
  {
    label: 'بروزرسانی فعالیت',
    value: 'UPDATE_ACTIVITY',
  },
  {
    label: 'حذف فعالیت',
    value: 'DELETE_ACTIVITY',
  },
  {
    label: 'بروزرسانی پروفایل',
    value: 'UPDATE_PROFILE',
  },
  {
    label: 'نمایش کاربر',
    value: 'SHOW_USER',
  },
  {
    label: 'ایجاد کاربر',
    value: 'CREATE_USER',
  },
  {
    label: 'بروزرسانی کاربر',
    value: 'UPDATE_USER',
  },
  {
    label: 'حذف کاربر',
    value: 'DELETE_USER',
  },
] as const;

const PERMISSION_LIST = PERMISSIONS.map((p) => p.value);

type PermissionsType = typeof PERMISSIONS;
type PermissionItemType = PermissionsType[number];
type Permission = PermissionItemType['value'];

export { PERMISSION_LIST, Permission };
export default PERMISSIONS;
