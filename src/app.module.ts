import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './controllers/auth/auth.module';
import { Report } from './models/report.entity';
import { User } from './models/user.entity';
import { ReportsModule } from './controllers/reports/reports.module';
import { UsersModule } from './controllers/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ReportsModule,
  ],
})
export class AppModule {}
