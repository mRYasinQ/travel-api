import { z } from 'zod';

import { PERMISSION_LIST } from '../../common/constants/Permissions';

const permissionsEnum = z.enum(PERMISSION_LIST);
const permissionsSchema = z.preprocess((value) => {
  let processedArray = [];

  if (typeof value === 'string') {
    processedArray = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  } else if (Array.isArray(value)) {
    processedArray = value;
  } else {
    return value;
  }

  return Array.from(new Set(processedArray));
}, z.array(permissionsEnum).min(1));

const baseRoleSchema = z.object({
  name: z.string().min(3).max(150),
  permissions: permissionsSchema,
});

const createRoleSchema = baseRoleSchema;

const updateRoleSchema = baseRoleSchema.partial();

const roleParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

type CreateRole = z.infer<typeof createRoleSchema>;
type UpdateRole = z.infer<typeof updateRoleSchema>;
type RoleParam = z.infer<typeof roleParamSchema>;

export { createRoleSchema, updateRoleSchema, roleParamSchema, CreateRole, UpdateRole, RoleParam };
