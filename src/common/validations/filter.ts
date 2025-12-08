import { z } from 'zod';

const orderByItemSchema = z.string().regex(/^[-]?\w+$/, "Invalid sort format. Use 'field' or '-field'");

const filterQuerySchema = z
  .object({
    order_by: z.preprocess((value) => {
      if (Array.isArray(value)) return value;

      if (typeof value === 'string') {
        return value
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }

      return value;
    }, z.array(orderByItemSchema)),
  })
  .partial();

type FilterQuery = z.infer<typeof filterQuerySchema>;

export { FilterQuery };
export default filterQuerySchema;
