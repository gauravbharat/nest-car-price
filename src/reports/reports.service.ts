import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { ApprovedReportDto } from './dtos/approved-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    reportDto.currency = reportDto.currency.toUpperCase();

    const report = this.repo.create(reportDto);
    // Repository will extract user ID from the User instance and save in the reports table
    report.user = user;
    return this.repo.save(report);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async remove(id: number) {
    const report = await this.findOne(id);

    if (!report) {
      throw new Error('no report found');
    }

    return this.repo.remove(report);
  }

  async changeApproval(id: number, dto: ApprovedReportDto) {
    const report = await this.findOne(id);

    if (!report) {
      throw new Error('no report found');
    }

    report.approved = dto.approved;

    return this.repo.save(report);
  }
}
