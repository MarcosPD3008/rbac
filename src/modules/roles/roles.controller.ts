import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { PostRoleDto } from './dto/post-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { PermissionToRoleDto } from './dto/permission-to-role.dto';
import { RolesPermissionsService } from 'src/common/services/roles-permissions.service';
import { EndpointInfo } from 'src/common/decorators/endpoint-info.decorator';
import { PaginatedResult, PaginateDto } from 'src/common/entities/paginatedResult';
import { PaginatedResponse } from 'src/common/decorators/pagination.decorator';

@ApiTags('Roles') // Groups endpoints under the "Roles" section in Swagger
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly rolesPermissionsService: RolesPermissionsService,
  ) {}

  @EndpointInfo({
    method: 'post',
    permission: 'Roles.Create',
    summary: 'Create a new role',
    responseType: GetRoleDto,
    statusCode: HttpStatus.CREATED,
  })
  async create(@Body() postRoleDto: PostRoleDto): Promise<GetRoleDto> {
    return this.rolesService.create(postRoleDto);
  }

  @EndpointInfo({
    method: 'post',
    path: ':id/permissions',
    permission: 'Roles.Update',
    summary: 'Add permissions to a role',
    responseType: GetRoleDto,
  })
  async addPermissionsToRole(
    @Param('id') id: string,
    @Body() body: PermissionToRoleDto,
  ): Promise<GetRoleDto> {
    const { permissionIds } = body;
    return this.rolesService.addPermissionsToRole(id, permissionIds);
  }

  @EndpointInfo({
    method: 'delete',
    path: ':id/permissions',
    permission: 'Roles.Update',
    summary: 'Remove permissions from a role',
    responseType: GetRoleDto,
  })
  async removePermissionsFromRole(
    @Param('id') id: string,
    @Body() body: PermissionToRoleDto,
  ): Promise<GetRoleDto> {
    const { permissionIds } = body;
    return this.rolesPermissionsService.removePermissionsFromRole(id, permissionIds);
  }

  @PaginatedResponse(GetRoleDto)
  @EndpointInfo({
    method: 'get',
    permission: 'Roles.Read',
    summary: 'Retrieve all roles',
  })
  async findAll(@Query() pagination:PaginateDto, 
                @Query() name?:string): Promise<PaginatedResult<GetRoleDto>> {
    return this.rolesService.findAll(pagination, name);
  }

  @EndpointInfo({
    method: 'get',
    path: ':id',
    permission: 'Roles.Read',
    summary: 'Retrieve a role by ID',
    responseType: GetRoleDto,
  })
  async findOne(@Param('id') id: string): Promise<GetRoleDto> {
    return this.rolesService.findOne(id);
  }

  @EndpointInfo({
    method: 'put',
    path: ':id',
    permission: 'Roles.Update',
    summary: 'Update a role by ID',
    responseType: GetRoleDto,
  })
  async update(
    @Param('id') id: string,
    @Body() postRoleDto: PostRoleDto,
  ): Promise<GetRoleDto> {
    return this.rolesService.update(id, postRoleDto);
  }

  @EndpointInfo({
    method: 'delete',
    path: ':id',
    permission: 'Roles.Delete',
    summary: 'Delete a role by ID',
    statusCode: HttpStatus.NO_CONTENT,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(id);
  }
}
