import { z } from 'zod';

import { PERMISSION_LIST } from '../../common/constants/Permissions';
import filterQuerySchema from '../../common/validations/filter';

const permissionsEnum = z.enum(PERMISSION_LIST);
const permissionsSchema = z.preprocess(
  (value) => {
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
  },
  z.array(permissionsEnum, 'دسترسی‌ها باید یک آرایه باشند.').min(1, 'حداقل باید یک دسترسی انتخاب شود.'),
);

const baseRoleSchema = z.object({
  name: z
    .string('نام باید رشته باشد.')
    .min(3, 'نام باید حداقل ۳ کارکتر باشد.')
    .max(150, 'نام می‌تواند حداکثر ۱۵۰ کارکتر باشد.'),
  permissions: permissionsSchema,
});

const createRoleSchema = baseRoleSchema;

const updateRoleSchema = baseRoleSchema.partial();

const roleParamSchema = z.object({
  id: z.coerce
    .number('شناسه نقش باید عددی باشد.')
    .int('شناسه نقش باید عددی باشد.')
    .positive('شناسه نقش باید عددی بزرگتر از صفر باشد.'),
});

const rolesQuerySchema = filterQuerySchema;

type CreateRole = z.infer<typeof createRoleSchema>;
type UpdateRole = z.infer<typeof updateRoleSchema>;
type RoleParam = z.infer<typeof roleParamSchema>;
type RolesQuery = z.infer<typeof rolesQuerySchema>;

export {
  createRoleSchema,
  updateRoleSchema,
  roleParamSchema,
  rolesQuerySchema,
  CreateRole,
  UpdateRole,
  RoleParam,
  RolesQuery,
};
