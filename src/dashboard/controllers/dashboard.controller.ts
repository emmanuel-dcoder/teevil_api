import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  Req,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/config/response';
import { DashboardService } from '../services/dashboard.service';

@ApiTags('Freelancer and Client Dashboard')
@Controller('api/v1/dashboard')
// @ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  @ApiOperation({ summary: 'Freelancer Dashboard chart analysis' })
  @ApiResponse({ status: 200, description: 'Analysis retrived' })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  async findOne() {
    const data = await this.dashboardService.freelancerDashboardAnalysis();
    return successResponse({
      message: 'Analysis retrived',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }
}
