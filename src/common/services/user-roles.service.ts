import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../base/base.repository';
import { User } from 'src/modules/users/users.entity';
import { Role } from 'src/modules/roles/roles.entity';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from 'src/modules/users/dto/get-users.dto';
import { GetRoleDto } from 'src/modules/roles/dto/get-role.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthAction } from '../enums/auth-actions';

@Injectable()
export class UserRolesService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: BaseRepository<User>,

    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: BaseRepository<Role>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Add or change a role for a user.
   * If the user has an existing role, replace it with the new one.
   */
  async addOrChangeRole(userId: string, roleId: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const previousRole = user.roles[0]?.id;

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    user.roles = [role];

    const updatedUser = await this.userRepository.save(user);

    this.eventEmitter.emit(AuthAction.USER_ROLE_CHANGED, { userId, newRole: roleId, previousRole });

    return plainToInstance(GetUserDto, updatedUser, { excludeExtraneousValues: true });
  }

  /**
   * Add a role to a user (without replacing existing roles).
   */
  async addRole(userId: string, roleId: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    if (!user.roles.some((existingRole) => existingRole.id === role.id)) {
      user.roles.push(role);
    }


    this.eventEmitter.emit(AuthAction.USER_ROLE_CHANGED, { userId, newRole: roleId });
  
    const updatedUser = await this.userRepository.save(user);
    return plainToInstance(GetUserDto, updatedUser, { excludeExtraneousValues: true });
  }

  /**
   * Remove a specific role from a user.
   */
  async removeRole(userId: string, roleId: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    user.roles = user.roles.filter((role) => role.id !== roleId);

    const updatedUser = await this.userRepository.save(user);

    this.eventEmitter.emit(AuthAction.USER_ROLE_DELETED, { userId, roleId });
    
    return plainToInstance(GetUserDto, updatedUser, { excludeExtraneousValues: true });
  }

  /**
   * Get all roles assigned to a user.
   */
  async getRolesByUser(userId: string): Promise<GetRoleDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.roles.map((role) =>
      plainToInstance(GetRoleDto, role, { excludeExtraneousValues: true }),
    );
  }

  /**
   * Get all users assigned to a specific role.
   */
  async getUsersByRole(roleId: string): Promise<GetUserDto[]> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['users'],
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    return role.users.map((user) =>
      plainToInstance(GetUserDto, user, { excludeExtraneousValues: true }),
    );
  }
}
