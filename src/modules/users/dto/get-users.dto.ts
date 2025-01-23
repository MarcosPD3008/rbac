import { Expose, Type } from "class-transformer";
import { GetRoleDto } from "src/modules/roles/dto/get-role.dto";
import { Role } from "src/modules/roles/roles.entity";

export class GetUserDto {
    @Expose()
    id: string;

    @Expose()
    username: string;

    @Expose()
    email: string;
    
    @Expose()
    @Type(() => GetRoleDto)
    roles: GetRoleDto[];
}