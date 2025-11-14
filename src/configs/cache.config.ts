import { getTableName } from 'drizzle-orm';
import { Cache, type MutationOption } from 'drizzle-orm/cache/core';
import type { CacheConfig } from 'drizzle-orm/cache/core/types';

import redisClient from './redis.config';

type RedisClient = typeof redisClient;
type RedisCacheConfig = CacheConfig & { global?: boolean };

const getByTagScript = `
local tagsMapKey = KEYS[1] -- tags map key
local tag        = ARGV[1] -- tag

local compositeTableName = redis.call('HGET', tagsMapKey, tag)
if not compositeTableName then
  return nil
end

local value = redis.call('HGET', compositeTableName, tag)
return value
`;

const onMutateScript = `
local tagsMapKey = KEYS[1] -- tags map key
local tables     = {}      -- initialize tables array
local tags       = ARGV    -- tags array

for i = 2, #KEYS do
  tables[#tables + 1] = KEYS[i] -- add all keys except the first one to tables
end

if #tags > 0 then
  for _, tag in ipairs(tags) do
    if tag ~= nil and tag ~= '' then
      local compositeTableName = redis.call('HGET', tagsMapKey, tag)
      if compositeTableName then
        redis.call('HDEL', compositeTableName, tag)
      end
    end
  end
  redis.call('HDEL', tagsMapKey, unpack(tags))
end

local keysToDelete = {}

if #tables > 0 then
  local compositeTableNames = redis.call('SUNION', unpack(tables))
  for _, compositeTableName in ipairs(compositeTableNames) do
    keysToDelete[#keysToDelete + 1] = compositeTableName
  end
  for _, table in ipairs(tables) do
    keysToDelete[#keysToDelete + 1] = table
  end
  redis.call('DEL', unpack(keysToDelete))
end
`;

class RedisCache extends Cache {
  static readonly entityKind = 'RedisCache';

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
      const result = await this.redis.hget(RedisCache.nonAutoInvalidateTablePrefix, key);
      return result ? JSON.parse(result) : undefined;
    }

    if (isTag) {
      const result = await this.redis.eval(getByTagScript, 1, RedisCache.tagsMapKey, key);
      return result ? JSON.parse(result as string) : undefined;
    }

    const compositeKey = this.getCompositeKey(tables);
    const result = await this.redis.hget(compositeKey, key);
    return result ? JSON.parse(result) : undefined;
  }

  override async put(
    key: string,
    response: unknown,
    tables: string[],
    isTag: boolean = false,
    config?: CacheConfig,
  ): Promise<void> {
    const isAutoInvalidate = tables.length > 0;
    const mergedConfig = { ...this.config, ...config };
    const serialized = JSON.stringify(response);

    const pipeline = this.redis.pipeline();

    if (!isAutoInvalidate) {
      if (isTag) {
        pipeline.hset(RedisCache.tagsMapKey, { [key]: RedisCache.nonAutoInvalidateTablePrefix });
        this.setHashFieldExpirationPipeline(pipeline, RedisCache.tagsMapKey, key, mergedConfig);
      }

      pipeline.hset(RedisCache.nonAutoInvalidateTablePrefix, { [key]: serialized });
      this.setHashFieldExpirationPipeline(pipeline, RedisCache.nonAutoInvalidateTablePrefix, key, mergedConfig);

      await pipeline.exec();
      return;
    }

    const compositeKey = this.getCompositeKey(tables);

    pipeline.hset(compositeKey, { [key]: serialized });
    this.setHashFieldExpirationPipeline(pipeline, compositeKey, key, mergedConfig);

    if (isTag) {
      pipeline.hset(RedisCache.tagsMapKey, { [key]: compositeKey });
      this.setHashFieldExpirationPipeline(pipeline, RedisCache.tagsMapKey, key, mergedConfig);
    }

    for (const table of tables) pipeline.sadd(this.addTablePrefix(table), compositeKey);

    await pipeline.exec();
  }

  private setHashFieldExpirationPipeline(
    pipeline: ReturnType<RedisClient['pipeline']>,
    hashKey: string,
    field: string,
    config?: CacheConfig,
  ) {
    if (!config) {
      pipeline.hexpire(hashKey, 1800, 'FIELDS', 1, field);
      return;
    }

    if (config.keepTtl) return;

    const expirations = {
      ex: () => pipeline.hexpire(hashKey, config.ex!, 'FIELDS', 1, field),
      px: () => pipeline.hpexpire(hashKey, config.px!, 'FIELDS', 1, field),
      exat: () => pipeline.call('HEXPIREAT', hashKey, config.exat!, 'FIELDS', 1, field),
      pxat: () => pipeline.call('HPEXPIREAT', hashKey, config.pxat!, 'FIELDS', 1, field),
    };

    const key = Object.keys(expirations).find((k) => config[k as keyof CacheConfig] !== undefined);
    if (!key) return;

    const expirationFn = expirations[key as keyof typeof expirations];
    expirationFn();
  }

  override async onMutate(params: MutationOption): Promise<void> {
    const tags = Array.isArray(params.tags) ? params.tags : params.tags ? [params.tags] : [];
    const tables = Array.isArray(params.tables) ? params.tables : params.tables ? [params.tables] : [];
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : getTableName(t)));

    const compositeTableSets = tableNames.map((t) => this.addTablePrefix(t));
    const allKeys = [RedisCache.tagsMapKey, ...compositeTableSets];

    await this.redis.eval(onMutateScript, allKeys.length, ...allKeys, ...tags);
  }

  private addTablePrefix = (table: string) => `${RedisCache.compositeTableSetPrefix}${table}`;

  private getCompositeKey = (tables: string[]) => `${RedisCache.compositeTablePrefix}${tables.sort().join(',')}`;
}

const redisCache = (config?: RedisCacheConfig) => new RedisCache(redisClient, config);

export default redisCache;
