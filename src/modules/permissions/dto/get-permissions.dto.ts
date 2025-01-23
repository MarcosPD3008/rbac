import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPermissionDto {
  @ApiProperty({
    description: 'Unique identifier of the permission',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the permission',
    example: 'Manage Users',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Description of the permission',
    example: 'Allows management of user accounts',
    required: false,
  })
  @Expose()
  description?: string;
}
