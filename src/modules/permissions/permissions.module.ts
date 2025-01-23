import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database/database.module";
import { PermissionService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";

@Module({
    imports: [
        DatabaseModule
    ],
    providers: [PermissionService],
    controllers: [PermissionsController],
})
export class PermissionsModule {}