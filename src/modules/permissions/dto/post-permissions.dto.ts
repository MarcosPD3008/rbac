import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostPermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'Manage Users',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the permission',
    example: 'Allows management of user accounts',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
