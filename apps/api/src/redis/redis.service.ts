import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  onModuleInit() {
    this.redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.logger.log('Connected to Redis');
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  getClient(): Redis {
    return this.redisClient;
  }

  /**
   * Acquires a distributed lock for a specific SKU using SETNX and owner validation.
   * @param sku The product variant SKU to lock
   * @param ttlSeconds The time to live for the lock in seconds (e.g., 900 for 15 minutes)
   * @returns UUID token if lock acquired, null otherwise
   */
  async acquireCheckoutLock(sku: string, ttlSeconds: number = 900): Promise<string | null> {
    const lockKey = `lock:sku:${sku}`;
    const token = randomUUID();
    // SETNX with EX: Returns "OK" if set, null if already exists
    const result = await this.redisClient.set(lockKey, token, 'EX', ttlSeconds, 'NX');
    return result === 'OK' ? token : null;
  }

  /**
   * Releases the distributed lock for a specific SKU, verifying ownership with UUID token.
   * @param sku The product variant SKU
   * @param token The owner validation UUID token
   */
  async releaseCheckoutLock(sku: string, token: string): Promise<void> {
    const lockKey = `lock:sku:${sku}`;
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await this.redisClient.eval(luaScript, 1, lockKey, token);
  }
}
