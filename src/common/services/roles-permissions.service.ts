import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../base/base.repository';
import { Role } from 'src/modules/roles/roles.entity';
import { Permission } from 'src/modules/permissions/permissions.entity';
import { plainToInstance } from 'class-transformer';
import { GetRoleDto } from 'src/modules/roles/dto/get-role.dto';
import { GetPermissionDto } from 'src/modules/permissions/dto/get-permissions.dto';

@Injectable()
export class RolesPermissionsService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly rolesRepository: BaseRepository<Role>,

    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionsRepository: BaseRepository<Permission>,
  ) {}

  /**
   * Assign one or more permissions to a role.
   */
  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<GetRoleDto> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const permissions = await this.permissionsRepository.findByIds(permissionIds);
    const invalidPermissions = permissionIds.filter(
      (id) => !permissions.some((permission) => permission.id === id),
    );

    if (invalidPermissions.length > 0) {
      console.warn(
        `The following permissions were not found and will be excluded: ${invalidPermissions.join(
          ', ',
        )}`,
      );
    }

    // Add the valid permissions
    role.permissions = [...role.permissions, ...permissions];

    // Remove duplicates
    role.permissions = Array.from(new Set(role.permissions));

    const updatedRole = await this.rolesRepository.save(role);
    return plainToInstance(GetRoleDto, updatedRole, { excludeExtraneousValues: true });
  }

  /**
   * Remove one or more permissions from a role.
   */
  async removePermissionsFromRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<GetRoleDto> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    role.permissions = role.permissions.filter(
      (permission) => !permissionIds.includes(permission.id),
    );

    const updatedRole = await this.rolesRepository.save(role);
    return plainToInstance(GetRoleDto, updatedRole, { excludeExtraneousValues: true });
  }

  /**
   * Get all permissions assigned to a role.
   */
  async getPermissionsByRole(roleId: string): Promise<GetPermissionDto[]> {
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.permissions.map((permission) =>
      plainToInstance(GetPermissionDto, permission, { excludeExtraneousValues: true }),
    );
  }

  /**
   * Get all roles that have a specific permission.
   */
  async getRolesByPermission(permissionId: string): Promise<GetRoleDto[]> {
    const permission = await this.permissionsRepository.findOne({
      where: { id: permissionId },
      relations: ['roles'],
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${permissionId} not found`);
    }

    return permission.roles.map((role) =>
      plainToInstance(GetRoleDto, role, { excludeExtraneousValues: true }),
    );
  }
}
