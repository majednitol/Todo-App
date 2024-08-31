
// import { Redis } from 'ioredis';
// const HOST = process.env.POST
// // Create a Redis client
// const redisClient = new Redis({
//   // host: 'redis-service', // for kubernete
//   host: "redis",
//   port: 6379,
//   retryStrategy: times => Math.min(times * 50, 2000),

// });
// redisClient.on('error', (err: any) => {
//   console.error('Error connecting to Redis:', err);
// });
// export default redisClient;


import { Redis } from 'ioredis';

const HOST = process.env.POST;

// Create a Redis client for publisher
const redisClient = new Redis({
  // host: 'redis-service', // for kubernete
  host: "redis",
  port: 6379,
  retryStrategy: times => Math.min(times * 50, 2000),
});

redisClient.on('error', (err: any) => {
  console.error('Error connecting to Redis (publisher):', err);
});

// Create a Redis client for subscriber
const subscriberRedisClient = new Redis({
  // host: 'redis-service', // for kubernete
  host: "redis",
  port: 6379,
  retryStrategy: times => Math.min(times * 50, 2000),
});

subscriberRedisClient.on('error', (err: any) => {
  console.error('Error connecting to Redis (subscriber):', err);
});

export { redisClient, subscriberRedisClient };