import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";
import { AuthController } from "./auth.controller";
import { UserModule } from "../users/user.module";
import { CommonModule } from "src/common/common.module";
import { DatabaseModule } from "src/config/database/database.module";
import { RedisTokenBlacklistService } from "./blacklist/blacklist-redis.service";
import { DbTokenBlacklistService, NoneTokenBlacklistService } from "./blacklist/blacklist-db.service";

const blacklistMode = process.env.BLACKLIST_MODE || 'none';

const blacklistProviders = {
  none: NoneTokenBlacklistService,
  redis: RedisTokenBlacklistService,
  db: DbTokenBlacklistService,
};

export const BlacklistProvider = {
  provide: 'BLACKLIST_SERVICE',
  useClass: blacklistProviders[blacklistMode] || NoneTokenBlacklistService,
};

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
    LocalStrategy,
    JwtStrategy,
    BlacklistProvider,
  ],
  exports: []
})
export class AuthModule {}