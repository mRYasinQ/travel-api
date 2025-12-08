import { z } from 'zod';

import filterQuerySchema from '../../common/validations/filter';
import paginationQuerySchema from '../../common/validations/pagination';

const baseActivitySchema = z.object({
  name: z.string().min(3).max(200),
});

const createActivitySchema = baseActivitySchema;

const updateActivitySchema = baseActivitySchema.partial();

const activityParamSchema = z.object({
  id: z.coerce.number().int().positive(),
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
