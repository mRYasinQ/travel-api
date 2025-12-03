import { z } from 'zod';

const createActivitySchema = z.object({
  name: z.string().min(3).max(200),
});

type CreateActivity = z.infer<typeof createActivitySchema>;

export { createActivitySchema, CreateActivity };
