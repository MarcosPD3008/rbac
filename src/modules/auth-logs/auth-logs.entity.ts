import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/modules/users/users.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/base/base.entity';
import { AuthAction } from 'src/common/enums/auth-actions';

@Entity('auth_logs')
export class AuthLog extends BaseEntity {
  @ManyToOne(() => User, (user) => user.authLogs, { nullable: true, onDelete: 'SET NULL' })
  @ApiHideProperty() // ✅ Hide this field in Swagger to prevent circular dependency
  user: User;

  @Column({ type: 'enum', enum: AuthAction })
  @ApiProperty({ example: AuthAction.LOGIN, description: 'Type of authentication action performed' })
  action: AuthAction;

  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({ example: '{"roleChangedFrom": "User", "roleChangedTo": "Admin"}', description: 'Additional details about the event' })
  details?: Record<string, any>;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ example: '192.168.1.1', description: 'IP address of the user' })
  ip?: string;

  @Column({ type: 'varchar', nullable: true })
  @ApiProperty({ example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', description: 'User agent of the requester' })
  userAgent?: string;
}