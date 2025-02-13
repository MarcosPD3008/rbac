import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { BlacklistedToken } from './blacklist.entity';
import { TokenBlacklistStrategy } from './blaclist.interface';

@Injectable()
export class DbTokenBlacklistService implements TokenBlacklistStrategy {
  constructor(
    @InjectRepository(BlacklistedToken)
    private readonly tokenRepository: Repository<BlacklistedToken>,
  ) {}

  async addToken(token: string, expiresAt: number): Promise<void> {
    await this.tokenRepository.save({ token, expiresAt });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const blacklistedToken = await this.tokenRepository.findOne({ where: { token } });
    return !!blacklistedToken;
  }

  async cleanUpExpiredTokens(): Promise<void> {
    await this.tokenRepository.delete({ expiresAt: LessThan(Date.now()) });
  }
}


@Injectable()
export class NoneTokenBlacklistService implements TokenBlacklistStrategy {
  async addToken(token: string, expiresAt: number): Promise<void> {
  }

  async isBlacklisted(token: string): Promise<boolean> {
    return false;
  }
}
