import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    
    // Mock the Redis client
    (service as any).redisClient = {
      set: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      disconnect: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('acquireCheckoutLock', () => {
    it('should acquire a lock and return true', async () => {
      const result = await service.acquireCheckoutLock('RN-DIA-18K-SZ14', 900);
      expect(result).toBe(true);
      expect((service as any).redisClient.set).toHaveBeenCalledWith(
        'lock:sku:RN-DIA-18K-SZ14',
        '1',
        'EX',
        900,
        'NX'
      );
    });

    it('should return false if lock is already taken (SETNX returns null)', async () => {
      (service as any).redisClient.set.mockResolvedValueOnce(null);
      const result = await service.acquireCheckoutLock('RN-DIA-18K-SZ14', 900);
      expect(result).toBe(false);
    });
  });
});
