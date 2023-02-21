import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './controllers/auth/auth.module';
import { Report } from './models/report.entity';
import { User } from './models/user.entity';
import { ReportsModule } from './controllers/reports/reports.module';
import { UsersModule } from './controllers/users/users.module';
import { APP_PIPE } from '@nestjs/core';
import * as session from 'express-session';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from '../db/data-source';

const validationPipe = new ValidationPipe({
  whitelist: true,
});

// const configureTypeORM = (config: ConfigService) => {
//   return {
//     type: 'sqlite',
//     database: config.get('DB_NAME'),
//     entities: [User, Report],
//     synchronize: true,
//   } as TypeOrmModuleOptions;
// };

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: configureTypeORM,
    // }),
    AuthModule,
    UsersModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: validationPipe,
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const appSession = session({
      secret: this.configService.get('SECRET'),
      resave: false,
      saveUninitialized: false,
    });

    consumer.apply(appSession).forRoutes('*');
  }
}
