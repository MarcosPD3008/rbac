import { Body, Controller, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PermissionService } from './permissions.service';
import { PostPermissionDto } from './dto/post-permissions.dto';
import { GetPermissionDto } from './dto/get-permissions.dto';
import { EndpointInfo } from 'src/common/decorators/endpoint-info.decorator';
import { PaginatedResult, PaginateDto } from 'src/common/entities/paginatedResult';
import { PaginatedResponse } from 'src/common/decorators/pagination.decorator';

@ApiTags('Permissions') // Group endpoints under "Permissions" in Swagger
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionService: PermissionService) {}

  @EndpointInfo({
    method: 'post',
    permission: 'Permissions.Create',
    summary: 'Create a new permission',
    responseType: GetPermissionDto,
    statusCode: HttpStatus.CREATED,
  })
  async create(@Body() postPermissionDto: PostPermissionDto): Promise<GetPermissionDto> {
    return this.permissionService.create(postPermissionDto);
  }

  @PaginatedResponse(GetPermissionDto)
  @EndpointInfo({
    method: 'get',
    permission: 'Permissions.Read',
    summary: 'Retrieve all permissions',
    responseType: PaginatedResult<GetPermissionDto>,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter permissions by name',
    type: String,
  })
  async findAll(@Query() pagination: PaginateDto,
                @Query("name") name:string
  ): Promise<PaginatedResult<GetPermissionDto>> {
    return this.permissionService.findAll(pagination, name);
  }

  @EndpointInfo({
    method: 'get',
    path: ':id',
    permission: 'Permissions.Read',
    summary: 'Retrieve a permission by ID',
    responseType: GetPermissionDto,
  })
  async findOne(@Param('id') id: string): Promise<GetPermissionDto> {
    return this.permissionService.findOne(id);
  }

  @EndpointInfo({
    method: 'put',
    path: ':id',
    permission: 'Permissions.Update',
    summary: 'Update a permission by ID',
    responseType: GetPermissionDto,
  })
  async update(
    @Param('id') id: string,
    @Body() postPermissionDto: PostPermissionDto,
  ): Promise<GetPermissionDto> {
    return this.permissionService.update(id, postPermissionDto);
  }

  @EndpointInfo({
    method: 'delete',
    path: ':id',
    permission: 'Permissions.Delete',
    summary: 'Delete a permission by ID',
    statusCode: HttpStatus.NO_CONTENT,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.permissionService.remove(id);
  }
}
