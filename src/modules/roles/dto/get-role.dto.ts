import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Permission } from 'src/modules/permissions/permissions.entity';
import { GetPermissionDto } from 'src/modules/permissions/dto/get-permissions.dto';

export class GetRoleDto {
  @ApiProperty({
    description: 'Unique identifier of the role',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'List of permissions associated with the role',
    type: [GetPermissionDto], 
  })
  @Expose()
  @Type(() => GetPermissionDto) // Map permissions to GetPermissionDto
  permissions: GetPermissionDto[];
}
