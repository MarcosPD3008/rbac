import { Body, Controller, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { PostUserDto } from './dto/post-users.dto';
import { GetUserDto } from './dto/get-users.dto';
import { UserRolesService } from 'src/common/services/user-roles.service';
import { RoleToUserDto } from './dto/role-to-user.dto';
import { EndpointInfo } from 'src/common/decorators/endpoint-info.decorator';
import { PaginatedResult, PaginateDto } from 'src/common/entities/paginatedResult';
import { PaginatedResponse } from 'src/common/decorators/pagination.decorator';

@ApiTags('Users') // Groups all endpoints under the "Users" section in Swagger
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly userRolesService: UserRolesService,
  ) {}

  @PaginatedResponse(GetUserDto)
  @EndpointInfo({
    method: 'get',
    permission: 'Users.Read',
    summary: 'Retrieve all users',
    responseType: PaginatedResult<GetUserDto>,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter users by name',
    type: String,
  })
  async findAll(@Query() pagination:PaginateDto, 
                @Query() name?:string): Promise<PaginatedResult<GetUserDto>> {
    return this.userService.findAll(pagination, name);
  }

  @EndpointInfo({
    method: 'get',
    path: ':id',
    permission: 'Users.Read',
    summary: 'Retrieve a user by ID',
    responseType: GetUserDto,
  })
  async findOne(@Param('id') id: string): Promise<GetUserDto> {
    return this.userService.findOne(id);
  }

  @EndpointInfo({
    method: 'post',
    permission: 'Users.Create',
    summary: 'Create a new user',
    responseType: GetUserDto,
    statusCode: HttpStatus.CREATED,
  })
  async create(@Body() postUserDto: PostUserDto): Promise<GetUserDto> {
    return this.userService.create(postUserDto);
  }

  @EndpointInfo({
    method: 'post',
    path: ':id/roles',
    permission: 'Users.Update',
    summary: 'Add or modify a role for a user',
    responseType: GetUserDto,
    statusCode: HttpStatus.CREATED,
  })
  async addOrModifyRole(
    @Param('id') userId: string,
    @Body() addRoleDto: RoleToUserDto,
  ): Promise<GetUserDto> {
    const roleId = Array.isArray(addRoleDto.roleId) ? addRoleDto.roleId[0] : addRoleDto.roleId;
    return this.userRolesService.addOrChangeRole(userId, roleId);
  }

  @EndpointInfo({
    method: 'put',
    path: ':id',
    permission: 'Users.Update',
    summary: 'Update an existing user by ID',
    responseType: GetUserDto,
  })
  async update(
    @Param('id') id: string,
    @Body() postUserDto: PostUserDto,
  ): Promise<GetUserDto> {
    return this.userService.update(id, postUserDto);
  }

  @EndpointInfo({
    method: 'delete',
    path: ':id/roles/:roleId',
    permission: 'Users.Update',
    summary: 'Remove a role from a user',
    responseType: GetUserDto,
    statusCode: HttpStatus.NO_CONTENT,
  })
  async removeRole(
    @Param('id') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<GetUserDto> {
    return this.userRolesService.removeRole(userId, roleId);
  }

  @EndpointInfo({
    method: 'delete',
    path: ':id',
    permission: 'Users.Delete',
    summary: 'Delete a user by ID',
    statusCode: HttpStatus.NO_CONTENT,
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
