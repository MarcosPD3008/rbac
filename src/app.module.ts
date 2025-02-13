import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { AuthLogsModule } from './modules/auth-logs/auth-logs.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    RolesModule, 
    PermissionsModule,
    AuthLogsModule,
    EventEmitterModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    }) 
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
