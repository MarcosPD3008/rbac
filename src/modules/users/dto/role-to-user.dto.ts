import { ApiProperty } from '@nestjs/swagger';

export class RoleToUserDto {
  @ApiProperty({
    description: 'The ID of the user to which the role(s) will be assigned',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'The ID(s) of the role(s) to assign. Can be a single role ID or an array of role IDs.',
    example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'],
    type: [String],
    required: false,
  })
  roleId?: string | string[];
}
