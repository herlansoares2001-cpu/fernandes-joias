import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

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
   * Acquires a distributed lock for a specific SKU using SETNX.
   * @param sku The product variant SKU to lock
   * @param ttlSeconds The time to live for the lock in seconds (e.g., 900 for 15 minutes)
   * @returns true if lock acquired, false otherwise
   */
  async acquireCheckoutLock(sku: string, ttlSeconds: number = 900): Promise<boolean> {
    const lockKey = `lock:sku:${sku}`;
    // SETNX with EX: Returns "OK" if set, null if already exists
    const result = await this.redisClient.set(lockKey, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  /**
   * Releases the distributed lock for a specific SKU.
   * @param sku The product variant SKU
   */
  async releaseCheckoutLock(sku: string): Promise<void> {
    const lockKey = `lock:sku:${sku}`;
    await this.redisClient.del(lockKey);
  }
}
