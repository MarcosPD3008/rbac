import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/services/redis.service';
import { TokenBlacklistStrategy } from './blaclist.interface';

@Injectable()
export class RedisTokenBlacklistService implements TokenBlacklistStrategy {
  constructor(private readonly redisService: RedisService) {}

  async addToken(token: string, expiresAt: number): Promise<void> {
    const redisClient = this.redisService.getClient();
    const ttl = Math.ceil((expiresAt - Date.now()) / 1000);
    await redisClient.set(token, 'blacklisted', 'EX', ttl);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const redisClient = this.redisService.getClient();
    return (await redisClient.get(token)) !== null;
  }
}
