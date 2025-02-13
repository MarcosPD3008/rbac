import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthLogService } from '../auth-logs.service';
import { AuthAction } from 'src/common/enums/auth-actions';

@Injectable()
export class AuthLogListener {
    constructor(private readonly authLogService: AuthLogService) {}

    @OnEvent(AuthAction.LOGIN)
    async handleLoginLog(payload: { userId: string }) {
        await this.authLogService.logEvent(AuthAction.LOGIN, payload.userId);
    }

    @OnEvent(AuthAction.LOGOUT)
    async handleLogoutLog(payload: { userId: string }) {
        await this.authLogService.logEvent(AuthAction.LOGOUT, payload.userId);
    }

    @OnEvent(AuthAction.USER_CREATED)
    async handleUserCreatedLog(payload: { userId: string; createdBy?: string }) {
        await this.authLogService.logEvent(AuthAction.USER_CREATED, payload.userId, {
            createdBy: payload.createdBy,
        });
    }

    @OnEvent(AuthAction.USER_UPDATED)
    async handleUserUpdatedLog(payload: { userId: string; details: Record<string, any> }) {
        await this.authLogService.logEvent(AuthAction.USER_UPDATED, payload.userId, payload.details);
    }

    @OnEvent(AuthAction.USER_ACTIVATED)
    async handleUserActivatedLog(payload: { userId: string }) {
        await this.authLogService.logEvent(AuthAction.USER_ACTIVATED, payload.userId);
    }

    @OnEvent(AuthAction.USER_DEACTIVATED)
    async handleUserDeactivatedLog(payload: { userId: string }) {
        await this.authLogService.logEvent(AuthAction.USER_DEACTIVATED, payload.userId);
    }

    @OnEvent(AuthAction.USER_ROLE_CHANGED)
    async handleUserRoleChangedLog(payload: { userId: string; previousRole?: string; newRole?: string }) {
        await this.authLogService.logEvent(AuthAction.USER_ROLE_CHANGED, payload.userId, {
            previousRole: payload.previousRole,
            newRole: payload.newRole,
        });
    }

    @OnEvent(AuthAction.USER_ROLE_DELETED)
    async handleUserRoleDeletedLog(payload: { userId: string; roleId: string }) {
      await this.authLogService.logEvent(AuthAction.USER_ROLE_DELETED, payload.userId, {
        roleId: payload.roleId,
      });
    }
}
