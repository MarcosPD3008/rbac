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
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
  import { PermissionService } from './permissions.service';
import { PostPermissionDto } from './dto/post-permissions.dto';
import { GetPermissionDto } from './dto/get-permissions.dto';
  
  @ApiTags('Permissions') // Group endpoints under "Permissions" in Swagger
  @Controller('permissions')
  export class PermissionsController {
    constructor(private readonly permissionService: PermissionService) {}
  
    /**
     * Create a new permission
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new permission' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'The permission has been successfully created.',
      type: GetPermissionDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data.',
    })
    async create(@Body() postPermissionDto: PostPermissionDto): Promise<GetPermissionDto> {
      return this.permissionService.create(postPermissionDto);
    }
  
    /**
     * Retrieve all permissions
     */
    @Get()
    @ApiOperation({ summary: 'Retrieve all permissions' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'List of permissions.',
      type: [GetPermissionDto],
    })
    async findAll(): Promise<GetPermissionDto[]> {
      return this.permissionService.findAll();
    }
  
    /**
     * Retrieve a permission by ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a permission by ID' })
    @ApiParam({
      name: 'id',
      description: 'Unique identifier of the permission',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'The permission has been successfully retrieved.',
      type: GetPermissionDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The permission with the specified ID was not found.',
    })
    async findOne(@Param('id') id: string): Promise<GetPermissionDto> {
      return this.permissionService.findOne(id);
    }
  
    /**
     * Update a permission by ID
     */
    @Put(':id')
    @ApiOperation({ summary: 'Update a permission by ID' })
    @ApiParam({
      name: 'id',
      description: 'Unique identifier of the permission',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'The permission has been successfully updated.',
      type: GetPermissionDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The permission with the specified ID was not found.',
    })
    async update(
      @Param('id') id: string,
      @Body() postPermissionDto: PostPermissionDto,
    ): Promise<GetPermissionDto> {
      return this.permissionService.update(id, postPermissionDto);
    }
  
    /**
     * Delete a permission by ID
     */
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a permission by ID' })
    @ApiParam({
      name: 'id',
      description: 'Unique identifier of the permission',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The permission has been successfully deleted.',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The permission with the specified ID was not found.',
    })
    async remove(@Param('id') id: string): Promise<void> {
      return this.permissionService.remove(id);
    }
  }
  