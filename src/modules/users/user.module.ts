import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/config/database/database.module';
import { UserService } from './user.service';
import { UsersController } from './user.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
}) 
export class UserModule {}
