import { ApiProperty } from '@nestjs/swagger';
import { AuthAction } from 'src/common/enums/auth-actions';

export class AuthLogDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001', description: 'User ID affected by the action' })
  userId: string;

  @ApiProperty({ example: AuthAction.LOGIN, description: 'Type of authentication action performed' })
  action: AuthAction;

  @ApiProperty({ example: '{"roleChangedFrom": "User", "roleChangedTo": "Admin"}', description: 'Additional details about the event', required: false })
  details?: Record<string, any>;

  @ApiProperty({ example: '192.168.1.1', description: 'IP address of the user', required: false })
  ip?: string;

  @ApiProperty({ example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', description: 'User agent of the requester', required: false })
  userAgent?: string;
}
