import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from '../dtos/create-report.dto';
import { GetEstimateDto } from '../dtos/get-estimate.dto';
import { Report } from '../models/report.entity';
import { User } from '../models/user.entity';
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

  createEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lat, lng, year, mileage } = estimateDto;

    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved = true')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameter('mileage', mileage)
      .limit(3)
      .getRawOne();
  }

  async update(id: number, updates: Partial<Report>) {
    let report = await this.findOne(id);

    if (!report) throw new NotFoundException('Report not found');

    report = { ...report, ...updates };

    return this.repo.save(report);
  }
}
