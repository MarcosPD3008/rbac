import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { UserModule } from "../users/user.module";
import { CommonModule } from "src/common/common.module";
import { TokenBlacklistService } from "./blacklist/blacklist.service";
import { DatabaseModule } from "src/config/database/database.module";

@Module({
    imports: [
        CommonModule,
        DatabaseModule,
        UserModule,
        PassportModule
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        TokenBlacklistService,
        LocalStrategy,
        JwtStrategy
    ],
    exports: []
})
export class AuthModule {}