import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenBlacklistStrategy } from '../blacklist/blaclist.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('BLACKLIST_SERVICE')
    private readonly tokenBlacklist: TokenBlacklistStrategy) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
      passReqToCallback: true, // Enables request injection in the validate method
    });
  }

  /**
   * Validate the JWT and check against the blacklist
   * @param req - The incoming HTTP request
   * @param payload - The decoded JWT payload
   */
  async validate(req: Request, payload: any): Promise<any> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); // Extract the token from the request

    // Check if the token is blacklisted
    const isBlacklisted = await this.tokenBlacklist.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return payload; // Return the payload if the token is valid
  }
}
