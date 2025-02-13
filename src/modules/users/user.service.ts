import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ILike, Repository } from 'typeorm';
import { PostUserDto } from './dto/post-users.dto';
import { GetUserDto } from './dto/get-users.dto';
import { User } from './users.entity';
import { BaseRepository } from 'src/common/base/base.repository';
import { Role } from '../roles/roles.entity';
import { EncryptionService } from 'src/common/services/encryption.service';
import { PaginatedResult, PaginateDto } from 'src/common/entities/paginatedResult';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthAction } from 'src/common/enums/auth-actions';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: BaseRepository<User>,
    private readonly encryptService: EncryptionService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async create(postUserDto: PostUserDto): Promise<GetUserDto> {
    postUserDto.password = await this.encryptService.hashPassword(postUserDto.password);

    const user = this.userRepository.create(postUserDto);
    const savedUser = await this.userRepository.save(user);

    this.eventEmitter.emit(AuthAction.USER_CREATED, { userId: savedUser.id });

    return plainToInstance(GetUserDto, savedUser, { excludeExtraneousValues: true });
  }

  async findAll(pagination:PaginateDto, name?:string): Promise<PaginatedResult<GetUserDto>> {
    const query = this.userRepository.createQueryBuilder('user')

    if(name !== undefined && name !== ''){
      query.where(`user.username ILIKE :name`, { name: `%${name}%` })
    }

    return query.paginate(pagination);
  }

  async findOne(id: string): Promise<GetUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return plainToInstance(GetUserDto, user, { excludeExtraneousValues: true });
  }

  async findByUsernameOrEmail(identifier: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [
        { username: ILike(identifier) },
        { email: ILike(identifier) }
      ],
      relations: ['roles', 'roles.permissions'], // Include roles and permissions
      select: ['id', 'username', 'email', 'password', 'isActive'], // Explicitly include the password
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async update(id: string, postUserDto: PostUserDto): Promise<GetUserDto> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.userRepository.save({ ...existingUser, ...postUserDto });

    this.eventEmitter.emit(AuthAction.USER_UPDATED, { userId: updatedUser.id, details: postUserDto });

    return plainToInstance(GetUserDto, updatedUser, { excludeExtraneousValues: true });
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    else {
      this.eventEmitter.emit(AuthAction.USER_DEACTIVATED, { userId: id });
    }
  }
}
