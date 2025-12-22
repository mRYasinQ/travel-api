import { z } from 'zod';

import filterQuerySchema from '../../common/validations/filter';
import paginationQuerySchema from '../../common/validations/pagination';
import { emailSchema, passwordSchema, usernameSchema } from '../../common/validations/user';

const baseUserSchema = z.object({
  first_name: z
    .string('نام باید رشته باشد.')
    .min(3, 'نام باید حداقل ۳ کارکتر باشد.')
    .max(30, 'نام می‌تواند حداکثر ۳۰ کارکتر باشد.')
    .nullable()
    .optional(),
  last_name: z
    .string('نام خانوادگی باید رشته باشد.')
    .min(3, 'نام خانوادگی باید حداقل ۳ کارکتر باشد.')
    .max(30, 'نام خانوادگی می‌تواند حداکثر ۳۰ کارکتر باشد.')
    .nullable()
    .optional(),
  email: emailSchema,
  username: usernameSchema,
  password: passwordSchema,
  role_id: z.coerce
    .number('نقش باید عددی باشد.')
    .int('نقش باید عددی باشد.')
    .positive('نقش باید عددی بزرگتر از صفر باشد.')
    .nullable()
    .optional(),
  is_active: z.boolean('وضعیت کاربر باید یک boolean باشد.').optional(),
  is_email_verified: z.boolean('وضعیت تایید ایمیل کاربر باید یک boolean باشد.').optional(),
});

const createUserSchema = baseUserSchema;

const updateUserSchema = baseUserSchema.partial();

const updateMeSchema = baseUserSchema
  .omit({ password: true, is_active: true, is_email_verified: true, role_id: true })
  .partial();

const userParamSchema = z.object({
  id: z.coerce
    .number('شناسه کاربر باید عددی باشد.')
    .int('شناسه کاربر باید عددی باشد.')
    .positive('شناسه کاربر باید عددی بزرگتر از صفر باشد.'),
});

const userParamWithUsernameSchema = z.object({
  username: usernameSchema,
});

const usersQuerySchema = filterQuerySchema.extend(
  paginationQuerySchema.extend({
    search: z.string('جستجو باید یک رشته باشد.').optional(),
  }).shape,
);

type CreateUser = z.infer<typeof createUserSchema>;
type UpdateUser = z.infer<typeof updateUserSchema>;
type UpdateMe = z.infer<typeof updateMeSchema>;
type UserParam = z.infer<typeof userParamSchema>;
type UserParamWithUsername = z.infer<typeof userParamWithUsernameSchema>;
type UsersQuery = z.infer<typeof usersQuerySchema>;

export {
  createUserSchema,
  updateUserSchema,
  updateMeSchema,
  userParamSchema,
  userParamWithUsernameSchema,
  usersQuerySchema,
  CreateUser,
  UpdateUser,
  UpdateMe,
  UserParam,
  UserParamWithUsername,
  UsersQuery,
};
