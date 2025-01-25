import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database/database.module";
import { UserRolesService } from "./services/user-roles.service";
import { RolesPermissionsService } from "./services/roles-permissions.service";
import { EncryptionService } from "./services/encryption.service";
import { JwtModule } from "@nestjs/jwt";
import { PermissionsGuard } from "./guards/permissions.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { RedisService } from "./services/redis.service";

@Module({
    imports: [
        DatabaseModule
    ],
    providers: [
        JwtAuthGuard, 
        PermissionsGuard, 
        UserRolesService,
        RolesPermissionsService,
        EncryptionService,
        RedisService
    ],
    exports: [
        UserRolesService,
        RolesPermissionsService,
        EncryptionService,
        RedisService
    ],
})
export class CommonModule {}