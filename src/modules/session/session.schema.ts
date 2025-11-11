import { z } from 'zod';

const sessionParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

type SessionParam = z.infer<typeof sessionParamSchema>;

export { sessionParamSchema, SessionParam };
