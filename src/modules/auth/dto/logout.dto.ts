import { IsNotEmpty, isString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
    @ApiProperty({ description: 'Refresh token' })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}