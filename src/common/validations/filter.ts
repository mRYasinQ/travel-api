import { z } from 'zod';

const orderByItemSchema = z
  .string()
  .regex(/^[-]?\w+$/, "فرمت مرتب‌سازی نامعتبر است. از 'field' یا 'field-' استفاده کنید.");

const filterQuerySchema = z
  .object({
    order_by: z.preprocess(
      (value) => {
        if (Array.isArray(value)) return value;

        if (typeof value === 'string') {
          return value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        }

        return value;
      },
      z.array(
        orderByItemSchema,
        'لیست مرتب‌سازی باید به صورت آرایه یا رشته‌ای از کلمات باشد که با ویرگول جدا شده‌اند.',
      ),
    ),
  })
  .partial();

type FilterQuery = z.infer<typeof filterQuerySchema>;

export { FilterQuery };
export default filterQuerySchema;
