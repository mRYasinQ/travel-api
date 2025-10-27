import { z } from 'zod';

const emailSchema = z.email().toLowerCase();
const passwordSchema = z.string().min(8).max(32);

export { emailSchema, passwordSchema };
