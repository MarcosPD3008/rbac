import { Controller, Body, Headers, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, RefreshTokenDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LogoutDto } from './dto/logout.dto';
import { EndpointInfo } from 'src/common/decorators/endpoint-info.decorator';

@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @EndpointInfo({
    method: 'post',
    path: 'login',
    permission: '', // Public route, no permission required
    summary: 'Authenticate user and return JWT tokens',
    responseType: AuthResponseDto,
    statusCode: HttpStatus.OK,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @EndpointInfo({
    method: 'post',
    path: 'refresh',
    permission: '', // Public route, no permission required
    summary: 'Refresh JWT tokens',
    responseType: AuthResponseDto,
    statusCode: HttpStatus.OK,
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @EndpointInfo({
    method: 'post',
    path: 'logout',
    permission: '', // Public route, no permission required
    summary: 'Logout a user and invalidate their tokens',
    statusCode: HttpStatus.NO_CONTENT,
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
