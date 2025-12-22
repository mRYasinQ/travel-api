import { z } from 'zod';

const clearSessionsSchema = z.object({
  clear_active: z.boolean('فیلد پاک کردن نشست فعال باید یک boolean باشد.').optional(),
});

const sessionParamSchema = z.object({
  id: z.coerce
    .number('شناسه نشست باید عددی باشد.')
    .int('شناسه نشست باید عددی باشد.')
    .positive('شناسه نشست باید عددی بزرگتر از صفر باشد.'),
});

type ClearSessions = z.infer<typeof clearSessionsSchema>;
type SessionParam = z.infer<typeof sessionParamSchema>;

export { clearSessionsSchema, sessionParamSchema, ClearSessions, SessionParam };
