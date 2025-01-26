import {
  applyDecorators,
  Delete,
  Get,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Permission } from './permission.decorator';

interface EndpointInfoOptions {
  method: 'get' | 'post' | 'put' | 'delete';
  path?: string;
  permission?: string;
  summary: string;
  responseType?: any;
  statusCode?: HttpStatus;
}

export function EndpointInfo({
  method,
  path = '',
  permission,
  summary,
  responseType,
  statusCode = HttpStatus.OK,
}: EndpointInfoOptions) {
  const methodDecorator = {
    get: Get(path),
    post: Post(path),
    put: Put(path),
    delete: Delete(path),
  }[method];

  const decorators = [
    methodDecorator,
    permission ? Permission(permission) : null, // Attach permission only if provided
    HttpCode(statusCode),
    ApiOperation({ summary }),
    responseType &&
      ApiResponse({
        status: statusCode,
        description: summary,
        type: responseType,
      }),
  ].filter(Boolean);

  return applyDecorators(...decorators);
}