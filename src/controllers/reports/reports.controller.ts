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
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/models/user.entity';
import { Serialize } from 'src/decorators/serialize.decorator';
import { ReportDto } from 'src/dtos/report.dto';
import { ApprovedReportDto } from 'src/dtos/approved-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDto } from 'src/dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    console.log(query);
    return this.reportsService.find();
  }

  @Get('/:id')
  getReportById(@Param('id') id: string) {
    return id;
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
