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

/**
 * 设置缓存和删除缓存操作，不论是否失败，都 resolve
 * 这是因为：
 * 1. 上次的缓存可能已经过期删除了
 * 2. 缓存服务可能暂时不可用
 * 3. 即使失败了，service 端在获取缓存时，发现获取不到，也会自动从 mongo 再获取一次
 */

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
