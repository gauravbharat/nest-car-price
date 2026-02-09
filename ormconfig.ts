// This file should be picked up by TypeOrmModule.forRoot() func execution in the App module

import { DataSource, DataSourceOptions } from 'typeorm';

const dbConfig: DataSourceOptions = {
  type: 'sqlite',
  database:
    process.env.NODE_ENV === 'production'
      ? 'prod.sqlite'
      : process.env.NODE_ENV === 'test'
        ? 'test.sqlite'
        : 'db.sqlite',
  entities:
    process.env.NODE_ENV === 'test'
      ? ['**/*.entity.ts']
      : ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['migrations/*.ts', 'migrations/*.js'],
  // migrationsRun: process.env.NODE_ENV === 'test',
};

export default new DataSource(dbConfig);
