import { z } from 'zod';

const { MAX_LIMIT_PAGINATION } = process.env;
const maxLimit = Number(MAX_LIMIT_PAGINATION);

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(maxLimit).optional().default(maxLimit),
});

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export { PaginationQuery };
export default paginationQuerySchema;
