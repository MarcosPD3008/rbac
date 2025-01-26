import { SelectQueryBuilder } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { PaginatedResult } from '../entities/paginatedResult';

declare module 'typeorm' {
  interface SelectQueryBuilder<Entity> {
    paginate<T>(
      options: { page?: number; limit?: number },
      dtoClass?: new (...args: any[]) => T,
    ): Promise<PaginatedResult<T>>;
  }
}

SelectQueryBuilder.prototype.paginate = async function <
  Entity,
  T = Entity,
>(
  this: SelectQueryBuilder<Entity>,
  options: { page?: number; limit?: number } = {},
  dtoClass?: new (...args: any[]) => T,
): Promise<PaginatedResult<T>> {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const offset = (page - 1) * limit;

  const [data, total] = await this.skip(offset).take(limit).getManyAndCount();

  const mappedData = dtoClass
    ? plainToInstance(dtoClass, data, { excludeExtraneousValues: true })
    : data;

  return {
    data: mappedData as T[],
    total,
    page: +page,
    limit: +limit,
  };
};
