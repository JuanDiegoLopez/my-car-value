import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

@Controller('reports')
export class ReportsController {
  @Get()
  getReports() {
    return [];
  }

  @Get('/:id')
  getReportById(@Param('id') id: string) {
    return id;
  }

  @Post()
  createReport(@Body() body: any) {
    return body;
  }

  @Patch('/:id')
  approveReport(@Param('id') id: string) {
    return id;
  }
}
