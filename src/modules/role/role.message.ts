const RoleMessage = Object.freeze({
  PERMISSIONS_RETRIEVED: 'Permissions retrieved successfully.',
  ROLES_RETRIEVED: 'Roles retrieved successfully.',
  ROLE_RETRIEVED: 'Role retrieved successfully.',
  ROLE_CREATED: 'Role created successfully.',
  ROLE_UPDATED: 'Role updated successfully.',
  ROLE_DELETED: 'Role deleted successfully.',
  ROLE_EXIST: 'Role with this name already exists.',
  NOT_FOUND: 'Role not found.',
  CANNOT_DELETE_OWN_ROLE: 'You cannot delete the role that is currently assigned to you.',
  CANNOT_UPDATE_OWN_ROLE_PERMISSIONS:
    'You cannot update the permissions of the role that is currently assigned to you.',
});

export default RoleMessage;
