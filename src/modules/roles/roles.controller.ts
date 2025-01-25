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
    UseGuards,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
  import { RolesService } from './roles.service';
  import { PostRoleDto } from './dto/post-role.dto';
  import { GetRoleDto } from './dto/get-role.dto';
import { PermissionToRoleDto } from './dto/permission-to-role.dto';
import { RolesPermissionsService } from 'src/common/services/roles-permissions.service';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
  
  @ApiTags('Roles') // Groups endpoints under the "Roles" section in Swagger
  @Controller('roles')
  // @UseGuards(PermissionsGuard)
  export class RolesController {
    constructor(private readonly rolesService: RolesService,
                private readonly rolesPermissionsService: RolesPermissionsService
    ) {}
  
    /**
     * Create a new role
     */
    @Post()
    @Permission("Roles.Create")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({
      status: HttpStatus.CREATED,
      description: 'The role has been successfully created.',
      type: GetRoleDto,
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid input data.',
    })
    async create(@Body() postRoleDto: PostRoleDto): Promise<GetRoleDto> {
      return this.rolesService.create(postRoleDto);
    }

    /**
     * Add one or more permissions to a role
     */
    @Post(':id/permissions')
    @Permission("Roles.Update")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add permissions to a role' })
    @ApiParam({
      name: 'id',
      description: 'The ID of the role to which permissions will be added',
      example: '123e4567-e89b-12d3-a456-426614174003',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Permissions successfully added to the role.',
      type: GetRoleDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The role or one or more permissions were not found.',
    })
    async addPermissionsToRole(
      @Param('id') id: string,
      @Body() body: PermissionToRoleDto,
    ): Promise<GetRoleDto> {
      const { permissionIds } = body;
      return this.rolesService.addPermissionsToRole(id, permissionIds);
    }

    /**
     * Add one or more permissions to a role
     */
    @Delete(':id/permissions')
    @Permission("Roles.Update")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add permissions to a role' })
    @ApiParam({
      name: 'id',
      description: 'The ID of the role to which permissions will be added',
      example: '123e4567-e89b-12d3-a456-426614174003',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Permissions successfully added to the role.',
      type: GetRoleDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The role or one or more permissions were not found.',
    })
    async removePermissionsFromRole(
      @Param('id') id: string,
      @Body() body: PermissionToRoleDto,
    ): Promise<GetRoleDto> {
      const { permissionIds } = body;
      return this.rolesPermissionsService.removePermissionsFromRole(id, permissionIds);
    }
  
    /**
     * Retrieve all roles
     */
    @Get()
    @Permission("Roles.Read")
    @ApiOperation({ summary: 'Retrieve all roles' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'List of roles.',
      type: [GetRoleDto],
    })
    async findAll(): Promise<GetRoleDto[]> {
      return this.rolesService.findAll();
    }
  
    /**
     * Retrieve a role by ID
     */
    @Get(':id')
    @Permission("Roles.Read")
    @ApiOperation({ summary: 'Retrieve a role by ID' })
    @ApiParam({
      name: 'id',
      description: 'Unique identifier of the role',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'The role has been successfully retrieved.',
      type: GetRoleDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The role with the specified ID was not found.',
    })
    async findOne(@Param('id') id: string): Promise<GetRoleDto> {
      return this.rolesService.findOne(id);
    }
  
    /**
     * Update a role by ID
     */
    @Put(':id')
    @Permission("Roles.Update")
    @ApiOperation({ summary: 'Update a role by ID' })
    @ApiParam({
      name: 'id',
      description: 'Unique identifier of the role',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'The role has been successfully updated.',
      type: GetRoleDto,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The role with the specified ID was not found.',
    })
    async update(
      @Param('id') id: string,
      @Body() postRoleDto: PostRoleDto,
    ): Promise<GetRoleDto> {
      return this.rolesService.update(id, postRoleDto);
    }
  
    /**
     * Delete a role by ID
     */
    @Delete(':id')
    @Permission("Roles.Delete")
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a role by ID' })
    @ApiParam({
      name: 'id',
      description: 'Unique identifier of the role',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'The role has been successfully deleted.',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'The role with the specified ID was not found.',
    })
    async remove(@Param('id') id: string): Promise<void> {
      return this.rolesService.remove(id);
    }
}
  