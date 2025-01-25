import { Controller, Post, Body, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, RefreshTokenDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LogoutDto } from './dto/logout.dto';

@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Logs in a user by validating credentials and returning JWT tokens.
   * @param loginDto - Contains username or email and password.
   * @returns JWT access and refresh tokens.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return JWT tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication successful, returns access and refresh tokens.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid username, email, or password.',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  /**
   * Refreshes tokens by validating the refresh token and issuing new tokens.
   * @param refreshTokenDto - Contains the refresh token.
   * @returns New JWT access and refresh tokens.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens refreshed successfully, returns new access and refresh tokens.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token.',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Logout a user and invalidate their tokens' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User successfully logged out',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid tokens',
  })
  async logout(
    @Headers('authorization') authorization: string,
    @Body() logoutDto: LogoutDto,
  ): Promise<void> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Error('Invalid or missing authorization header');
    }

    const accessToken = authorization.replace('Bearer ', ''); // Extract token from the header
    await this.authService.logout(accessToken, logoutDto.refreshToken);
  }
}
