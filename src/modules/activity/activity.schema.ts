import { z } from 'zod';

import filterQuerySchema from '../../common/validations/filter';
import paginationQuerySchema from '../../common/validations/pagination';

const baseActivitySchema = z.object({
  name: z
    .string('نام باید رشته باشد.')
    .min(3, 'نام باید حداقل ۳ کارکتر باشد.')
    .max(200, 'نام می‌تواند حداکثر ۲۰۰ کارکتر باشد.'),
});

const createActivitySchema = baseActivitySchema;

const updateActivitySchema = baseActivitySchema.partial();

const activityParamSchema = z.object({
  id: z.coerce
    .number('شناسه فعالیت باید عددی باشد.')
    .int('شناسه فعالیت باید عددی باشد.')
    .positive('شناسه فعالیت باید عددی بزرگتر از صفر باشد.'),
});

const activitiesQuerySchema = filterQuerySchema.extend(paginationQuerySchema.shape);

type CreateActivity = z.infer<typeof createActivitySchema>;
type UpdateActivity = z.infer<typeof updateActivitySchema>;
type ActivityParam = z.infer<typeof activityParamSchema>;
type ActivitiesQuery = z.infer<typeof activitiesQuerySchema>;

export {
  createActivitySchema,
  updateActivitySchema,
  activityParamSchema,
  activitiesQuerySchema,
  CreateActivity,
  UpdateActivity,
  ActivityParam,
  ActivitiesQuery,
};
