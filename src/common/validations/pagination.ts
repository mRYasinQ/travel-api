import { z } from 'zod';

const paginationQuerySchema = z
  .object({
    page: z.coerce.number().int().positive(),
    limit: z.coerce.number().int().positive(),
  })
  .partial();

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export { PaginationQuery };
export default paginationQuerySchema;
