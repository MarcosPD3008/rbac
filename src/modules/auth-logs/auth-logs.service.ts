import { Inject, Injectable, Scope } from '@nestjs/common';
import { PaginatedResult, PaginateDto } from 'src/common/entities/paginatedResult';
import { AuthLog } from './auth-logs.entity';
import { BaseRepository } from 'src/common/base/base.repository';
import { REQUEST } from '@nestjs/core';
import { Request } from "express";
import { AuthAction } from 'src/common/enums/auth-actions';

@Injectable({ scope: Scope.REQUEST }) // Make it request-scoped to access request data
export class AuthLogService {
  constructor(
    @Inject('AUTH_LOGS_REPOSITORY')
    private readonly authLogRepository: BaseRepository<AuthLog>,
    @Inject(REQUEST) private readonly request: Request, // Inject the current request

  ) {}

  /**
   * Logs an authentication-related event
   * @param userId - (Optional) User ID affected by the action
   * @param action - Type of authentication action performed
   * @param details - (Optional) Additional details about the event
   */
  async logEvent(action: AuthAction, userId?: string, details?: Record<string, any>) {
    const ip = this.request?.ip || null;
    const userAgent = this.request?.headers ? this.request?.headers['user-agent'] : null; // Get user agent

    const logEntry = this.authLogRepository.create({
      user: userId ? { id: userId } : null,
      action,
      details: details || null,
      ip,
      userAgent,
    });

    await this.authLogRepository.save(logEntry);
  }


  /**
   * Retrieve logs with optional filtering and pagination
   * @param pagination - Pagination options
   * @param userId - (Optional) Filter logs for a specific user
   */
  async findAll(pagination: PaginateDto, userId?: string): Promise<PaginatedResult<AuthLog>> {
    const query = this.authLogRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC');

    if (userId?.trim()) {
      query.where('log.userId = :userId', { userId });
    }

    return query.paginate(pagination);
  }
}
