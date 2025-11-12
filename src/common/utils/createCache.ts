import type { CacheConfig } from 'drizzle-orm/cache/core/types';
import ms from 'ms';

import redisCache from '../../configs/cache.config';
import { tables } from '../../configs/entities.config';

const { DB_CACHE_QUERY_DEFAULT } = process.env;

const cacheManager = redisCache();

const cacheQuery = async <T>(
  cacheKey: string,
  tablesToInvalidate: (keyof typeof tables)[],
  queryFn: () => Promise<T>,
  config: CacheConfig = { px: ms(DB_CACHE_QUERY_DEFAULT) },
  isTag: boolean = false,
): Promise<T> => {
  const cachedResult = await cacheManager.get(
    cacheKey,
    tablesToInvalidate.map((t) => String(t)),
    isTag,
  );
  if (cachedResult !== undefined) return cachedResult as T;

  const result = await queryFn();

  await cacheManager.put(
    cacheKey,
    result,
    tablesToInvalidate.map((t) => String(t)),
    isTag,
    config,
  );

  return result;
};

export default cacheQuery;
