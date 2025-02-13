import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PaginateDto, PaginatedResult } from 'src/common/entities/paginatedResult';
import { PaginatedResponse } from 'src/common/decorators/pagination.decorator';
import { EndpointInfo } from 'src/common/decorators/endpoint-info.decorator';
import { AuthLogService } from './auth-logs.service';
import { AuthLog } from './auth-logs.entity';

@ApiTags('Auth-Logs')
@Controller('auth-logs')
export class AuthLogsController {
  constructor(private readonly authLogService: AuthLogService) {}

  @PaginatedResponse(AuthLog)
  @EndpointInfo({
    method: 'get',
    permission: 'AuthLogs.Read',
    summary: 'Retrieve authentication logs',
    responseType: PaginatedResult<AuthLog>,
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter logs by user ID',
    type: String,
  })
  async findAll(
    @Query() pagination: PaginateDto,
    @Query('userId') userId?: string,
  ): Promise<PaginatedResult<AuthLog>> {
    return this.authLogService.findAll(pagination, userId);
  }
}
