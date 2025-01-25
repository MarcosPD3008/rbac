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
import { UserService } from './user.service';
import { PostUserDto } from './dto/post-users.dto';
import { GetUserDto } from './dto/get-users.dto';
import { UserRolesService } from 'src/common/services/user-roles.service';
import { RoleToUserDto } from './dto/role-to-user.dto';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { Type } from 'class-transformer';

@ApiTags('Users') // Groups all endpoints under the "Users" section in Swagger
@Controller('users')
@UseGuards(PermissionsGuard)
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly userRolesService: UserRolesService,
  ) {}

  @Get()
  @Permission("Users.Read")
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all users',
    type: [GetUserDto],
  })
  async findAll(): Promise<GetUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Permission("Users.Read")
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User retrieved successfully',
    type: GetUserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.findOne(id);
  }

  @Post()
  @Permission("Users.Create")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created',
    type: GetUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async create(@Body() postUserDto: PostUserDto): Promise<GetUserDto> {
    return this.userService.create(postUserDto);
  }

  @Post(':id/roles')
  @Permission("Users.Update")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add or modify a role for a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role successfully added/modified for the user',
    type: GetUserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User or role not found',
  })
  async addOrModifyRole(
    @Param('id') userId: string,
    @Body() addRoleDto: RoleToUserDto,
  ): Promise<GetUserDto> {
    const roleId = Array.isArray(addRoleDto.roleId) ? addRoleDto.roleId[0] : addRoleDto.roleId;

    return this.userRolesService.addOrChangeRole(userId, roleId);
  }

  @Put(':id')
  @Permission("Users.Update")
  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User updated successfully',
    type: GetUserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async update(
    @Param('id') id: string,
    @Body() postUserDto: PostUserDto,
  ): Promise<GetUserDto> {
    return this.userService.update(id, postUserDto);
  }

  @Delete(':id/roles/:roleId')
  @Permission("Users.Update")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiParam({ name: 'id', description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiParam({ name: 'roleId', description: 'Role ID', example: '123e4567-e89b-12d3-a456-426614174001' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Role successfully removed from the user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User or role not found',
  })
  async removeRole(
    @Param('id') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<GetUserDto> {
    return this.userRolesService.removeRole(userId, roleId);
  }

  @Delete(':id')
  @Permission("Users.Delete")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
