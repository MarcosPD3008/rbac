import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { AuthLogService } from "./auth-logs.service";
import { AuthLogsController } from "./auth-logs.controller";
import { DatabaseModule } from "src/config/database/database.module";
import { AuthLogListener } from "./events/auth-logs.listener";

@Module({
    imports: [
        CommonModule,
        DatabaseModule
    ],
    controllers: [
        AuthLogsController
    ],
    providers: [
        AuthLogService,
        AuthLogListener
    ],
    exports: []
})
export class AuthLogsModule {}