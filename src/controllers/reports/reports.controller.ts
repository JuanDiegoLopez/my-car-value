import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from '../../services/reports.service';
import { CreateReportDto } from '../../dtos/create-report.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { User } from '../../models/user.entity';
import { Serialize } from '../../decorators/serialize.decorator';
import { ReportDto } from '../../dtos/report.dto';
import { ApprovedReportDto } from '../../dtos/approved-report.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { GetEstimateDto } from '../../dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@CurrentUser() user: User, @Body() body: CreateReportDto) {
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApprovedReportDto) {
    return this.reportsService.update(parseInt(id), body);
  }
}
