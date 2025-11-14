import type { CacheConfig } from 'drizzle-orm/cache/core/types';
import ms from 'ms';

import redisCache from '../../configs/cache.config';
import { tables } from '../../configs/entities.config';

type Tables = keyof typeof tables;
type QueryFn<T> = () => Promise<T>;
type CacheQueryConfig = {
  tablesToInvalidate?: Tables[];
  isTag?: boolean;
  cacheConfig?: CacheConfig;
};

const { DB_CACHE_QUERY_DEFAULT } = process.env;

const cacheManager = redisCache();

const cacheQuery = async <T>(
  cacheKey: string,
  queryFn: QueryFn<T>,
  { tablesToInvalidate, isTag, cacheConfig }: CacheQueryConfig = {
    isTag: false,
    cacheConfig: { px: ms(DB_CACHE_QUERY_DEFAULT) },
  },
): Promise<T> => {
  const tables = tablesToInvalidate ?? [];
  const isAutoInvalidate = tables.length > 0;

  const cachedResult = await cacheManager.get(cacheKey, tables, isTag, isAutoInvalidate);
  if (cachedResult !== undefined) return cachedResult as T;

  const result = await queryFn();
  if (result === undefined) return result;

  await cacheManager.put(cacheKey, result, tables, isTag, cacheConfig);

  return result;
};

export default cacheQuery;
