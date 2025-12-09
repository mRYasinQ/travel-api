import type { AnyColumn, SQL } from 'drizzle-orm';
import { asc, desc } from 'drizzle-orm';

type DrizzleColumns = {
  [key: string]: AnyColumn | SQL;
};

const getOrderByConfig = (orderByItems: string[] | undefined, allowedColumns: DrizzleColumns): SQL[] => {
  if (!orderByItems || orderByItems.length === 0) return [];

  const orderByExpressions: SQL[] = [];

  for (const item of orderByItems) {
    const isDescending = item.startsWith('-');
    const fieldName = isDescending ? item.substring(1) : item;

    const column = allowedColumns[fieldName];

    if (column) {
      const orderExpression = isDescending ? desc(column) : asc(column);
      orderByExpressions.push(orderExpression);
    }
  }

  return orderByExpressions;
};

export { getOrderByConfig };
