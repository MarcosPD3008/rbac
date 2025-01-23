
import { Module } from '@nestjs/common';
import { AppDataSource, databaseProviders, repositoryProviders } from './database.providers';

@Module({
  providers: [...databaseProviders, ...repositoryProviders],
  exports: [...databaseProviders, ...repositoryProviders],
})
export class DatabaseModule {}