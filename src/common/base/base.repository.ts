import { DeepPartial, FindOptionsWhere, ObjectId, Repository, UpdateResult } from 'typeorm';
import { BaseEntity } from './base.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T extends BaseEntity> extends Repository<T> {
  //TODO: Add real logic to get user id
  getUserId(): string {
    return 'system';
  }

  override create(): T;
  override create(entityLikeArray: DeepPartial<T>[]): T[];
  override create(entityLike: DeepPartial<T>): T;
  override create(entityLike?: DeepPartial<T> | DeepPartial<T>[]): T | T[] {
    if (Array.isArray(entityLike)) {
      return entityLike.map(entity => {
        entity.createdBy = this.getUserId();
        entity.createdAt = new Date();
        return super.create(entity);
      });
    } 
    else if (entityLike) {
      entityLike.createdBy = this.getUserId();
      entityLike.createdAt = new Date();
      return super.create(entityLike);
    } 
    else {
      return super.create();
    }
  }

  override async update(criteria: string | number | Date | ObjectId | string[] | number[] | Date[] | ObjectId[] | FindOptionsWhere<T>, partialEntity: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    if (partialEntity instanceof Object) {
      partialEntity = {
        ...partialEntity,
        updatedBy: this.getUserId(),
        updatedAt: new Date(),
      }
    }
    return super.update(criteria, partialEntity);
  }
}

