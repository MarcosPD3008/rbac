import { Expose } from "class-transformer";
import { BaseEntity, IBaseEntity } from "src/common/base/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles/roles.entity";
import { AuthLog } from "../auth-logs/auth-logs.entity";
import { ApiHideProperty } from "@nestjs/swagger";
  
@Entity('users')
export class User extends BaseEntity {
    @Column({ unique: true, nullable: true })
    @Expose()
    username?: string;

    @Column({ unique: true, nullable: true })
    @Expose()
    email?: string;

    @Column({ select: false }) // Exclude from queries by default
    password: string;

    @Column({ default: true })
    @Expose()
    isActive: boolean;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable()
    @Expose()
    roles: Role[];
    @OneToMany(() => AuthLog, (authLog) => authLog.user, { cascade: true })
    @ApiHideProperty() // ✅ Hide this in Swagger to prevent circular dependency
    authLogs: AuthLog[];
}
