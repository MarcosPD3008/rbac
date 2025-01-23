import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsArray, ArrayUnique } from 'class-validator';

export class PostRoleDto {
  @ApiProperty({
    description: 'Name of the role to be created',
    example: 'Admin',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'List of permission IDs to be assigned to the role',
    example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'],
    type: [String],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  permissions: string[];
}
