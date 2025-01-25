import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostPermissionDto {
  @ApiProperty({
    description: 'Name of the permission',
    example: 'Manage Users',
  })
  @Matches(/^[a-zA-Z.]+$/, {
    message: 'Name can only contain letters and periods',
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
