import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from 'src/dtos/create-report.dto';
import { Report } from 'src/models/report.entity';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create(reportDto);
    report.user = user;

    return this.repo.save(report);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find() {
    return this.repo.find();
  }

  async update(id: number, updates: Partial<Report>) {
    let report = await this.findOne(id);

    if (!report) throw new NotFoundException('Report not found');

    report = { ...report, ...updates };

    return this.repo.save(report);
  }
}
