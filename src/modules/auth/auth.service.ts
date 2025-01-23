import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { EncryptionService } from 'src/common/services/encryption.service';
import { User } from '../users/users.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Validate user credentials (username or email and password)
   * @param identifier - User's username or email
   * @param password - User's password
   * @returns User object if valid, null otherwise
   */
  async validateUser(identifier: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsernameOrEmail(identifier);

    if(!user){
      throw new NotFoundError('User not found');
    }

    if(!user.isActive){
      throw new UnauthorizedException('User is not active');
    }

    if (user && (await this.encryptionService.verifyPassword(password, user.password))) {
      return user;
    }

    throw new UnauthorizedException('Invalid username, email, or password');
  }

  /**
   * Handles user login by validating credentials and generating a JWT token.
   * The JWT payload includes permissions instead of roles.
   * 
   * @param identifier - The user's username or email.
   * @param password - The user's password.
   * @returns An object containing the generated access token.
   */
  async login(identifier: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.validateUser(identifier, password);
    const permissions = user.roles.flatMap((role) => role.permissions.map((perm) => perm.name))
                                  .filter((value, index, self) => self.indexOf(value) === index);

    const payload = { username: user.username, sub: user.id, permissions };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Generate JWT for a given user (optional use case)
   * @param user - The user object
   * @returns JWT token
   */
  async generateToken(user: User): Promise<string> {
    const permissions = user.roles.flatMap((role) => role.permissions.map((perm) => perm.name))
                                  .filter((value, index, self) => self.indexOf(value) === index);
    const payload = { username: user.username, sub: user.id, permissions };
    return this.jwtService.sign(payload);
  }
}
