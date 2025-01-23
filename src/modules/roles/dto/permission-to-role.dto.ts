import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID, ArrayUnique } from 'class-validator';

export class PermissionToRoleDto {
  @ApiProperty({
    description: 'Array of permission IDs to assign to the role',
    example: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ],
  })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  @IsNotEmpty({ each: true })
  permissionIds: string[];
}
