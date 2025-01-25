import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Permission } from 'src/modules/permissions/permissions.entity';
import { User } from 'src/modules/users/users.entity';
import { Role } from 'src/modules/roles/roles.entity';
import { BlacklistedToken } from 'src/modules/auth/blacklist/blacklist.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Role, Permission, BlacklistedToken],
  migrations: ['dist/migrations/*.js'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
});

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      return AppDataSource;
    },
  },
];

export const repositoryProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      const repository = dataSource.getRepository(User);
      return repository;
    },
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      const repository = dataSource.getRepository(Role);
      return repository;
    },
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PERMISSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      const repository = dataSource.getRepository(Permission);
      return repository;
    },
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'BLACKLISTED_TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      const repository = dataSource.getRepository(BlacklistedToken);
      return repository;
    },
    inject: ['DATA_SOURCE'],
  }
];

export default AppDataSource;