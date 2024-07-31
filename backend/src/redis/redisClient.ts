
import { Redis } from 'ioredis';

// Create a Redis client
const redisClient = new Redis({
  host: 'redis',
  port: 6379,

});
redisClient.on('error', (err: any) => {
  console.error('Error connecting to Redis:', err);
});
export default redisClient;
