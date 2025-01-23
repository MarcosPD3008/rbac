import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/config/database/database.module";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { CommonModule } from "src/common/common.module";

@Module({
    imports: [DatabaseModule, CommonModule],
    controllers: [RolesController],
    providers: [RolesService]
})
export class RolesModule {}