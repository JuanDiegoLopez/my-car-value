import { DataSource, DataSourceOptions } from 'typeorm';

function getDataSourceOptions() {
  const options = {
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
  };

  switch (process.env.NODE_ENV) {
    case 'development':
      Object.assign(options, {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: ['**/*.entity.js'],
      });
      break;
    case 'test':
      Object.assign(options, {
        type: 'sqlite',
        database: 'test.sqlite',
        entities: ['**/*.entity.ts'],
        migrationsRun: true,
      });
      break;
    case 'production':
      Object.assign(options, {
        type: 'postgres',
        database: process.env.DATABASE_URL,
        entities: ['**/*.entity.js'],
        migrationsRun: true,
        ssl: {
          rejectUnauthorized: false,
        },
      });
      break;
    default:
      throw new Error('Unknown environment');
  }

  return options as DataSourceOptions;
}

const dataSourceOptions = getDataSourceOptions();
const dataSource = new DataSource(dataSourceOptions);

export { dataSourceOptions };
export default dataSource;
