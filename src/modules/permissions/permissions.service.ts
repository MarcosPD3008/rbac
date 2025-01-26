import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BaseRepository } from 'src/common/base/base.repository';
import { Permission } from './permissions.entity';
import { PostPermissionDto } from './dto/post-permissions.dto';
import { GetPermissionDto } from './dto/get-permissions.dto';
import { PaginatedResult, PaginateDto } from 'src/common/entities/paginatedResult';
@Injectable()
export class PermissionService {
  constructor(
    @Inject('PERMISSION_REPOSITORY')
    private readonly permissionRepository: BaseRepository<Permission>,
  ) {}

  /**
   * Create a new permission
   */
  async create(data: PostPermissionDto): Promise<GetPermissionDto> {
    const permission = this.permissionRepository.create(data);
    const savedPermission = await this.permissionRepository.save(permission);
    return plainToInstance(GetPermissionDto, savedPermission, {
      excludeExtraneousValues: true, 
    });
  }

  /**
   * Retrieve all permissions
   */
  async findAll(pagination:PaginateDto, name?:string): Promise<PaginatedResult<GetPermissionDto>> {

    let query = this.permissionRepository.createQueryBuilder();

    if(name)
      query = query.where("name like :name", { name: `%${name}%` });

    return query.paginate(pagination, GetPermissionDto);
  }

  /**
   * Retrieve a permission by ID
   */
  async findOne(id: string): Promise<GetPermissionDto> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
    return plainToInstance(GetPermissionDto, permission, { excludeExtraneousValues: true });
  }

  /**
   * Update a permission by ID
   */
  async update(id: string, data: PostPermissionDto): Promise<GetPermissionDto> {
    const existingPermission = await this.permissionRepository.findOne({ where: { id } });
    if (!existingPermission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    const updatedPermission = await this.permissionRepository.save({
      ...existingPermission,
      ...data,
    });

    return plainToInstance(GetPermissionDto, updatedPermission, { excludeExtraneousValues: true });
  }

  /**
   * Delete a permission by ID
   */
  async remove(id: string): Promise<void> {
    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }
  }
}
