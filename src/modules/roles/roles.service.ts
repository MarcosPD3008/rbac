import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Role } from './roles.entity';
import { BaseRepository } from 'src/common/base/base.repository';
import { GetRoleDto } from './dto/get-role.dto';
import { PostRoleDto } from './dto/post-role.dto';
import { Permission } from 'src/modules/permissions/permissions.entity';
import { In } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @Inject('ROLE_REPOSITORY')
    private readonly rolesRepository: BaseRepository<Role>,

    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionsRepository: BaseRepository<Permission>,
  ) {}

  /**
   * Create a new role
   */
  async create(data: PostRoleDto): Promise<GetRoleDto> {
    const { name, permissions } = data;
  
    const permissionEntities = await this.permissionsRepository.findBy({ id: In(permissions) });
  
    const invalidPermissions = permissions.filter(
      (permissionId) => !permissionEntities.some((permission) => permission.id === permissionId),
    );
  
    if (invalidPermissions.length > 0) {
      console.warn(
        `The following permissions were not found and will be excluded: ${invalidPermissions.join(
          ', ',
        )}`,
      );
    }
  
    const role = this.rolesRepository.create({
      name,
      permissions: permissionEntities, // Only valid permissions included
    });
  
    const savedRole = await this.rolesRepository.save(role);
    return plainToInstance(GetRoleDto, savedRole, { excludeExtraneousValues: true });
  }
  

  /**
   * Retrieve all roles
   */
  async findAll(): Promise<GetRoleDto[]> {
    const roles = await this.rolesRepository.find({ relations: ['permissions'] });
    return roles.map((role) =>
      plainToInstance(GetRoleDto, role, { excludeExtraneousValues: true }),
    );
  }

  /**
   * Retrieve a role by ID
   */
  async findOne(id: string): Promise<GetRoleDto> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return plainToInstance(GetRoleDto, role, { excludeExtraneousValues: true });
  }

  /**
   * Update a role by ID
   */
  async update(id: string, data: PostRoleDto): Promise<GetRoleDto> {
    const { name, permissions } = data;

    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    const permissionEntities = await this.permissionsRepository.findBy({
      id: In(permissions),
    });

    const invalidPermissions = permissions.filter(
      (permissionId) =>
        !permissionEntities.some((permission) => permission.id === permissionId),
    );

    if (invalidPermissions.length > 0) {
      throw new NotFoundException(
        `The following permissions were not found: ${invalidPermissions.join(', ')}`,
      );
    }

    role.name = name;
    role.permissions = permissionEntities;

    const updatedRole = await this.rolesRepository.save(role);

    return plainToInstance(GetRoleDto, updatedRole, {
      excludeExtraneousValues: true,
    });
  }
  
 /**
   * Add one or more permissions to a role
   * @param roleId The ID of the role
   * @param permissionIds The ID(s) of the permissions to add (string | string[])
   */
  async addPermissionsToRole(
    roleId: string,
    permissionIds: string | string[],
  ): Promise<GetRoleDto> {
    // Ensure the role exists
    const role = await this.rolesRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Normalize permissionIds into an array
    const ids = Array.isArray(permissionIds) ? permissionIds : [permissionIds];

    // Fetch the Permission entities by their IDs
    const permissionEntities = await this.permissionsRepository.findBy({ id: In(ids) });

    if (permissionEntities.length === 0) {
      throw new NotFoundException('No valid permissions found for the provided IDs');
    }

    // Filter out permissions that are already associated with the role
    const newPermissions = permissionEntities.filter(
      (permission) => !role.permissions.some((existing) => existing.id === permission.id),
    );

    if (newPermissions.length === 0) {
      throw new NotFoundException('No new permissions to add. All provided permissions already exist');
    }

    // Add the new permissions to the role
    role.permissions = [...role.permissions, ...newPermissions];

    // Save the updated role
    const updatedRole = await this.rolesRepository.save(role);

    // Return the updated role as a DTO
    return plainToInstance(GetRoleDto, updatedRole, { excludeExtraneousValues: true });
  }

  /**
   * Delete a role by ID
   */
  async remove(id: string | number): Promise<void> {
    const result = await this.rolesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
  }
}
