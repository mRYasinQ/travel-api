import { z } from 'zod';

const clearSessionsSchema = z.object({
  clear_active: z.boolean().optional(),
});

const sessionParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

type ClearSessions = z.infer<typeof clearSessionsSchema>;
type SessionParam = z.infer<typeof sessionParamSchema>;

export { clearSessionsSchema, sessionParamSchema, ClearSessions, SessionParam };
