import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  // Restrict response to only expose those properties as required. Without the
  // restricting DTO and Serialize interceptor, the response return the User entity with password!!
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async approveReport(
    @Param('id') id: string,
    @Body() body: ApprovedReportDto,
  ) {
    if (!id || isNaN(parseInt(id))) {
      throw new BadRequestException();
    }

    try {
      const res = await this.reportsService.changeApproval(+id, body);
      return res;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteReport(@Param('id') id: string) {
    if (!id || isNaN(parseInt(id))) {
      throw new BadRequestException();
    }

    try {
      const res = await this.reportsService.remove(+id);
      return res;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
