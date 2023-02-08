import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [AuthModule, ReportsModule],
})
export class AppModule {}
