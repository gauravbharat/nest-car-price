import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApprovedReportDto } from './dtos/approved-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';

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
