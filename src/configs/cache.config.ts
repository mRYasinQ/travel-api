import { getTableName } from 'drizzle-orm';
import type { MutationOption } from 'drizzle-orm/cache/core';
import { Cache } from 'drizzle-orm/cache/core';
import type { CacheConfig } from 'drizzle-orm/cache/core/types';

import redisClient from './redis.config';

type RedisClient = typeof redisClient;
type RedisMode = 'NX' | 'XX' | 'GT' | 'LT' | undefined;
type RedisCacheConfig = CacheConfig & {
  global?: boolean;
};

class RedisCache extends Cache {
  static readonly entityKind: string = 'RedisCache';

  private static compositeTableSetPrefix = '__CTS__';
  private static compositeTablePrefix = '__CT__';
  private static tagsMapKey = '__tagsMap__';
  private static nonAutoInvalidateTablePrefix = '__nonAutoInvalidate__';

  constructor(
    public redis: RedisClient,
    protected config: RedisCacheConfig = { global: false },
  ) {
    super();
  }

  public strategy(): 'all' | 'explicit' {
    return this.config?.global ? 'all' : 'explicit';
  }

  override async get(
    key: string,
    tables: string[],
    isTag: boolean = false,
    isAutoInvalidate?: boolean,
  ): Promise<unknown[] | undefined> {
    if (!isAutoInvalidate) {
      const result = await this.redis.hGet(RedisCache.nonAutoInvalidateTablePrefix, key);
      return result ? JSON.parse(result) : undefined;
    }

    if (isTag) {
      const compositeTableName = await this.redis.hGet(RedisCache.tagsMapKey, key);
      if (!compositeTableName) return undefined;

      const value = await this.redis.hGet(compositeTableName, key);
      return value ? JSON.parse(value) : undefined;
    }

    const compositeKey = this.getCompositeKey(tables);

    const result = await this.redis.hGet(compositeKey, key);
    return result ? JSON.parse(result) : undefined;
  }

  override async put(
    key: string,
    response: unknown,
    tables: string[],
    isTag: boolean = false,
    config?: CacheConfig,
  ): Promise<void> {
    const isAutoInvalidate = tables.length !== 0;
    const mergedConfig = { ...this.config, ...config };
    const serializedResponse = JSON.stringify(response);

    if (!isAutoInvalidate) {
      if (isTag) {
        await this.redis.hSet(RedisCache.tagsMapKey, key, RedisCache.nonAutoInvalidateTablePrefix);
        await this.setHashFieldExpiration(RedisCache.tagsMapKey, key, mergedConfig);
      }

      await this.redis.hSet(RedisCache.nonAutoInvalidateTablePrefix, key, serializedResponse);
      await this.setHashFieldExpiration(RedisCache.nonAutoInvalidateTablePrefix, key, mergedConfig);

      return;
    }

    const compositeKey = this.getCompositeKey(tables);

    await this.redis.hSet(compositeKey, key, serializedResponse);
    await this.setHashFieldExpiration(compositeKey, key, mergedConfig);

    if (isTag) {
      await this.redis.hSet(RedisCache.tagsMapKey, key, compositeKey);
      await this.setHashFieldExpiration(RedisCache.tagsMapKey, key, mergedConfig);
    }

    for (const table of tables) {
      await this.redis.sAdd(this.addTablePrefix(table), compositeKey);
    }
  }

  private async setHashFieldExpiration(hashKey: string, field: string, config?: CacheConfig): Promise<void> {
    if (!config) {
      await this.redis.hExpire(hashKey, field, 1800);
      return;
    }

    if (config.keepTtl) return;

    const mode = config.hexOptions?.toUpperCase() as RedisMode;

    if (config.ex !== undefined) {
      await this.redis.hExpire(hashKey, field, config.ex, mode);
    } else if (config.px !== undefined) {
      await this.redis.hpExpire(hashKey, field, config.px, mode);
    } else if (config.exat !== undefined) {
      await this.redis.hExpireAt(hashKey, field, config.exat, mode);
    } else if (config.pxat !== undefined) {
      await this.redis.hpExpireAt(hashKey, field, config.pxat, mode);
    }
  }

  override async onMutate(params: MutationOption): Promise<void> {
    const tags = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tables = Array.isArray(params.tables) ? params.tables : params.tables ? [params.tables] : [];

    const tableNames: string[] = tables.map((table) => {
      if (typeof table === 'string') return table;
      return getTableName(table);
    });

    if (tags.length > 0) {
      for (const tag of tags) {
        if (tag) {
          const compositeTableName = await this.redis.hGet(RedisCache.tagsMapKey, tag);
          if (compositeTableName) await this.redis.hDel(compositeTableName, tag);
        }
      }
      await this.redis.hDel(RedisCache.tagsMapKey, tags);
    }

    if (tableNames.length > 0) {
      const compositeTableSets = tableNames.map((table) => this.addTablePrefix(table));
      const keysToDelete: string[] = [];

      for (const setKey of compositeTableSets) {
        const compositeTableNames = await this.redis.sMembers(setKey);
        keysToDelete.push(...compositeTableNames);
      }

      if (keysToDelete.length > 0) await this.redis.del([...keysToDelete, ...compositeTableSets]);
    }
  }

  private addTablePrefix = (table: string): string => `${RedisCache.compositeTableSetPrefix}${table}`;

  private getCompositeKey = (tables: string[]): string => {
    return `${RedisCache.compositeTablePrefix}${tables.sort().join(',')}`;
  };
}

const redisCache = (config?: RedisCacheConfig) => new RedisCache(redisClient, config);

export default redisCache;
