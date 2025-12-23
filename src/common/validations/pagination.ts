import { z } from 'zod';

const { MAX_LIMIT_PAGINATION } = process.env;
const maxLimit = Number(MAX_LIMIT_PAGINATION);

const paginationQuerySchema = z.object({
  page: z.coerce
    .number('شماره صفحه باید عددی باشد.')
    .int('شماره صفحه باید عددی باشد.')
    .positive('شماره صفحه باید عددی بزرگتر از صفر باشد.')
    .optional()
    .default(1),
  limit: z.coerce
    .number('تعداد نمایش در هر صفحه باید عددی باشد.')
    .int('تعداد نمایش در هر صفحه باید عددی باشد.')
    .positive('تعداد نمایش در هر صفحه باید عددی بزرگتر از صفر باشد.')
    .max(maxLimit)
    .optional()
    .default(maxLimit),
});

type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export { PaginationQuery };
export default paginationQuerySchema;
