import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { EncryptionService } from 'src/common/services/encryption.service';
import { User } from '../users/users.entity';
import { NotFoundError } from 'rxjs';
import { TokenBlacklistService } from './blacklist/blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
    private readonly tokenBlacklistService: TokenBlacklistService
  ) {}

  /**
   * Validate user credentials (username or email and password)
   * @param identifier - User's username or email
   * @param password - User's password
   * @returns User object if valid, throws an exception otherwise
   */
  async validateUser(identifier: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsernameOrEmail(identifier);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    if (await this.encryptionService.verifyPassword(password, user.password)) {
      return user;
    }

    throw new UnauthorizedException('Invalid username, email, or password');
  }

  /**
   * Handles user login by validating credentials and generating both access and refresh tokens.
   * @param identifier - The user's username or email.
   * @param password - The user's password.
   * @returns An object containing the generated access and refresh tokens.
   */
  async login(
    identifier: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(identifier, password);
  
    // Generate permissions for the user
    const permissions = user.roles
      .flatMap((role) => role.permissions.map((perm) => perm.name))
      .filter((value, index, self) => self.indexOf(value) === index);
  
    // Generate access token with type 'access'
    const accessToken = this.jwtService.sign(
      { username: user.username, sub: user.id, permissions, type: 'access' },
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
    );
  
    // Generate refresh token with type 'refresh'
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' },
    );
  
    return { accessToken, refreshToken };
  }

  /**
   * Refresh tokens by validating the current refresh token and generating new tokens.
   * @param refreshToken - The refresh token to validate
   * @returns An object containing the new access and refresh tokens.
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken);
  
      // Ensure the token type is 'refresh'
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token type');
      }
  
      // Fetch the user's data from the database
      const user = await this.usersService.findOne(payload.sub);
  
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
  
      if (!user.isActive) {
        throw new UnauthorizedException('User is not active');
      }
  
      // Generate permissions from user roles
      const permissions = user.roles
        .flatMap((role) => role.permissions.map((perm) => perm.name))
        .filter((value, index, self) => self.indexOf(value) === index);
  
      // Generate new access token
      const newAccessToken = this.jwtService.sign(
        { username: user.username, sub: user.id, permissions },
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
      );
  
      // Generate new refresh token (minimal payload)
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' },
      );
  
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  

  /**
   * Logs out a user by blacklisting their access and refresh tokens.
   * @param accessToken - The user's access token.
   * @param refreshToken - The user's refresh token.
   */
  async logout(accessToken: string, refreshToken: string): Promise<void> {
    try {
      // Decode both tokens to get their expiration times
      const accessPayload = this.jwtService.decode(accessToken) as any;
      const refreshPayload = this.jwtService.decode(refreshToken) as any;

      // Blacklist access token
      if (accessPayload?.exp) {
        await this.tokenBlacklistService.addToken(accessToken, accessPayload.exp * 1000);
      }

      // Blacklist refresh token
      if (refreshPayload?.exp) {
        await this.tokenBlacklistService.addToken(refreshToken, refreshPayload.exp * 1000);
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid tokens');
    }
  }
}