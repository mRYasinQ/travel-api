import { z } from 'zod';

const baseActivitySchema = z.object({
  name: z.string().min(3).max(200),
});

const createActivitySchema = baseActivitySchema;

const updateActivitySchema = baseActivitySchema.partial();

const activityParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

type CreateActivity = z.infer<typeof createActivitySchema>;
type UpdateActivity = z.infer<typeof updateActivitySchema>;
type ActivityParam = z.infer<typeof activityParamSchema>;

export {
  createActivitySchema,
  updateActivitySchema,
  activityParamSchema,
  CreateActivity,
  UpdateActivity,
  ActivityParam,
};
