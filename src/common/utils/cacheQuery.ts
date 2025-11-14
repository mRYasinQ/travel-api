import type { CacheConfig } from 'drizzle-orm/cache/core/types';
import ms from 'ms';

import redisCache from '../../configs/cache.config';
import { tables } from '../../configs/entities.config';

type Tables = keyof typeof tables;
type QueryFn<T> = () => Promise<T>;

const { DB_CACHE_QUERY_DEFAULT } = process.env;

const cacheManager = redisCache();

const cacheQuery = async <T>(
  cacheKey: string,
  tablesToInvalidate: Tables[],
  queryFn: QueryFn<T>,
  config: CacheConfig = { px: ms(DB_CACHE_QUERY_DEFAULT) },
  isTag: boolean = false,
): Promise<T> => {
  const cachedResult = await cacheManager.get(cacheKey, tablesToInvalidate, isTag);
  if (cachedResult !== undefined) return cachedResult as T;

  const result = await queryFn();

  await cacheManager.put(cacheKey, result, tablesToInvalidate, isTag, config);

  return result;
};

export default cacheQuery;
