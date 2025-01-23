import { Expose } from "class-transformer";
import { BaseEntity, IBaseEntity } from "src/common/base/base.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles/roles.entity";
  
@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose()
    id: string;

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
}
