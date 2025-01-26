import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResult } from '../entities/paginatedResult';

export function PaginatedResponse<TModel extends Type<any>>(model?: TModel) {
  const extraModels = model ? [PaginatedResult, model] : [PaginatedResult];
  return applyDecorators(
    ApiExtraModels(...extraModels),
    ApiResponse({
      status: 200,
      description: 'Paginated response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResult) },
          ...(model
            ? [
                {
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(model) },
                    },
                  },
                },
              ]
            : []),
        ],
      },
    }),
  );
}
