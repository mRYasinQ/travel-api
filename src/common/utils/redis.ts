import redisClient from '../../configs/redis.config';

const execAndExtract = async <T>(multi: ReturnType<typeof redisClient.multi>): Promise<T> => {
  const results = await multi.exec();
  if (!results) throw new Error();

  const extractedResults: unknown[] = [];

  for (const [error, result] of results) {
    if (error) throw error;
    extractedResults.push(result);
  }

  return extractedResults as T;
};

export { execAndExtract };
