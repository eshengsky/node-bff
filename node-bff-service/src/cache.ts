import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URI, {
  keyPrefix: process.env.REDIS_KEY_PREFIX,
});
redis.on('connect', () => {
  console.info('Redis connected!');
});

redis.on('error', (err: Error) => {
  console.error('Redis connect error:', err);
});

redis.on('end', () => {
  console.error('Redis connection closed！');
});

const getCache = (key: string): Promise<any> => redis.get(key);

const setCache = (key: string, value: string): Promise<void> => new Promise((resolve) => {
  redis.set(key, value, 'EX', process.env.REDIS_TTL).then(() => {
    resolve();
  }).catch((err: Error) => {
    console.error(err);
    resolve();
  });
});

const delCache = (key: string): Promise<void> => new Promise((resolve) => {
  redis.del(key).then(() => {
    resolve();
  }).catch((err: Error) => {
    console.error(err);
    resolve();
  });
});

export {
  getCache,
  setCache,
  delCache,
};
