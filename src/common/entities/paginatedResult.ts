import { IsOptional, IsInt, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'typeorm';

export class PaginatedResult<T> {
  @ApiProperty({
    description: 'Array of items on the current page',
    type: "array",
    isArray: true,
  })
  data: T[];

  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: "number"
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: "number"
  })
  limit: number;
}


export class PaginateDto {
    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiProperty({
        description: 'Number of items per page',
        example: 10,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit: number = 10;
}
