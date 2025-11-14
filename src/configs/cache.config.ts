import { getTableName } from 'drizzle-orm';
import type { MutationOption } from 'drizzle-orm/cache/core';
import { Cache } from 'drizzle-orm/cache/core';
import type { CacheConfig } from 'drizzle-orm/cache/core/types';

import redisClient from './redis.config';

type RedisClient = typeof redisClient;
type RedisMode = 'NX' | 'XX' | 'GT' | 'LT' | undefined;
type RedisCacheConfig = CacheConfig & { global?: boolean };
type Expirations = Record<string, () => Promise<unknown>>;

const getByTagLua = `
local tagsMapKey = KEYS[1]
local tag = ARGV[1]
local compositeTableName = redis.call('HGET', tagsMapKey, tag)
if not compositeTableName then return nil end
local value = redis.call('HGET', compositeTableName, tag)
return value
`;

const onMutateLua = `
local tagsMapKey = KEYS[1]
local tags = ARGV
local tables = {}
for i = 2, #KEYS do tables[#tables+1] = KEYS[i] end
if #tags > 0 then
  for _, tag in ipairs(tags) do
    if tag and tag ~= '' then
      local compositeTableName = redis.call('HGET', tagsMapKey, tag)
      if compositeTableName then redis.call('HDEL', compositeTableName, tag) end
    end
  end
  redis.call('HDEL', tagsMapKey, unpack(tags))
end
if #tables > 0 then
  local compositeTableNames = redis.call('SUNION', unpack(tables))
  local keysToDelete = {}
  for _, compositeTableName in ipairs(compositeTableNames) do
    keysToDelete[#keysToDelete+1] = compositeTableName
  end
  for _, table in ipairs(tables) do keysToDelete[#keysToDelete+1] = table end
  redis.call('DEL', unpack(keysToDelete))
end
`;

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
      const result = await this.redis.eval(getByTagLua, {
        keys: [RedisCache.tagsMapKey],
        arguments: [key],
      });

      return result ? JSON.parse(String(result)) : undefined;
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
    const serialized = JSON.stringify(response);

    if (!isAutoInvalidate) {
      if (isTag) {
        await this.redis.hSet(RedisCache.tagsMapKey, key, RedisCache.nonAutoInvalidateTablePrefix);
        await this.setHashFieldExpiration(RedisCache.tagsMapKey, key, mergedConfig);
      }

      await this.redis.hSet(RedisCache.nonAutoInvalidateTablePrefix, key, serialized);
      await this.setHashFieldExpiration(RedisCache.nonAutoInvalidateTablePrefix, key, mergedConfig);
      return;
    }

    const compositeKey = this.getCompositeKey(tables);

    await this.redis.hSet(compositeKey, key, serialized);
    await this.setHashFieldExpiration(compositeKey, key, mergedConfig);

    if (isTag) {
      await this.redis.hSet(RedisCache.tagsMapKey, key, compositeKey);
      await this.setHashFieldExpiration(RedisCache.tagsMapKey, key, mergedConfig);
    }

    for (const table of tables) {
      await this.redis.sAdd(this.addTablePrefix(table), compositeKey);
    }
  }

  private async setHashFieldExpiration(hashKey: string, field: string, config?: CacheConfig) {
    if (!config) {
      await this.redis.hExpire(hashKey, field, 1800);
      return;
    }

    if (config.keepTtl) return;

    const mode = config.hexOptions?.toUpperCase() as RedisMode;

    const expirations: Expirations = {
      ex: () => this.redis.hExpire(hashKey, field, config.ex!, mode),
      px: () => this.redis.hpExpire(hashKey, field, config.px!, mode),
      exat: () => this.redis.hExpireAt(hashKey, field, config.exat!, mode),
      pxat: () => this.redis.hpExpireAt(hashKey, field, config.pxat!, mode),
    };

    const key = Object.keys(expirations).find((key) => config[key as keyof CacheConfig] !== undefined);
    if (!key) return;

    const value = expirations[key];
    await value();
  }

  override async onMutate(params: MutationOption): Promise<void> {
    const tags = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tables = Array.isArray(params.tables) ? params.tables : params.tables ? [params.tables] : [];
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : getTableName(t)));

    const compositeTableSets = tableNames.map((t) => this.addTablePrefix(t));

    await this.redis.eval(onMutateLua, {
      keys: [RedisCache.tagsMapKey, ...compositeTableSets],
      arguments: tags,
    });
  }

  private addTablePrefix = (table: string) => `${RedisCache.compositeTableSetPrefix}${table}`;

  private getCompositeKey = (tables: string[]) => `${RedisCache.compositeTablePrefix}${tables.sort().join(',')}`;
}

const redisCache = (config?: RedisCacheConfig) => new RedisCache(redisClient, config);

export default redisCache;
