import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URI, {
  keyPrefix: process.env.REDIS_KEY_PREFIX
});
redis.on('connect', () => {
  console.info('Redis connected!');
});

redis.on('error', (err) => {
  console.error('Redis connect error:', err);
});

redis.on('end', () => {
  console.error('Redis connection closed！');
});

const setCache = (key: string, value: string): Promise<void> => {
  return new Promise((resolve) => {
    redis.set(key, value, 'EX', process.env.REDIS_TTL).then(() => {
      resolve();
    }).catch((err) => {
      console.error(err);
      resolve();
    });
  });
};

const delCache = (key: string): Promise<void> => {
  return new Promise((resolve) => {
    redis.del(key).then(() => {
      resolve();
    }).catch((err) => {
      console.error(err);
      resolve();
    });
  });
};

export {
  setCache,
  delCache
};
