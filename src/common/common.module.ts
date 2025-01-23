import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database/database.module";
import { UserRolesService } from "./services/user-roles.service";
import { RolesPermissionsService } from "./services/roles-permissions.service";
import { EncryptionService } from "./services/encryption.service";
import { JwtModule } from "@nestjs/jwt";
import { PermissionsGuard } from "./guards/permissions.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";

@Module({
    imports: [
        DatabaseModule
    ],
    providers: [
        JwtAuthGuard, 
        PermissionsGuard, 
        UserRolesService,
        RolesPermissionsService,
        EncryptionService
    ],
    exports: [
        UserRolesService,
        RolesPermissionsService,
        EncryptionService
    ],
})
export class CommonModule {}