import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { BlacklistedToken } from './blacklist.entity';
import { RedisService } from 'src/common/services/redis.service';

@Injectable()
export class TokenBlacklistService implements OnModuleInit {
    private mode: 'none' | 'db' | 'redis';

    constructor(
        @Inject("BLACKLISTED_TOKEN_REPOSITORY")
        private readonly tokenRepository: Repository<BlacklistedToken>,
        private readonly redisService: RedisService,
    ) {}

    onModuleInit() {
        this.mode = process.env.BLACKLIST_MODE as 'none' | 'db' | 'redis';
    }

    /**
     * Adds a token to the blacklist
     */
    async addToken(token: string, expiresAt: number): Promise<void> {
        if (this.mode === 'none') return;

        if (this.mode === 'db') {
        await this.tokenRepository.save({ token, expiresAt });
        } 
        else if (this.mode === 'redis') {
        const redisClient = this.redisService.getClient();
        const ttl = Math.ceil((expiresAt - Date.now()) / 1000); // Calculate TTL
        await redisClient.set(token, 'blacklisted', 'EX', ttl);
        }
    }

    /**
     * Checks if a token is blacklisted
     */
    async isBlacklisted(token: string): Promise<boolean> {
        if (this.mode === 'none') return false;

        if (this.mode === 'db') {
        const blacklistedToken = await this.tokenRepository.findOne({ where: { token } });
        return !!blacklistedToken;
        }
        else if (this.mode === 'redis') {
        const redisClient = this.redisService.getClient();
        return (await redisClient.get(token)) !== null;
        }

        return false;
    }

    /**
     * Cleans up expired tokens (DB mode only)
     */
    async cleanUpExpiredTokens(): Promise<void> {
        if (this.mode === 'db') {
        await this.tokenRepository.delete({ expiresAt: LessThan(Date.now()) });
        }
    }
}
