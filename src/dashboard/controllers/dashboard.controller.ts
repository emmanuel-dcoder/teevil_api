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
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('/freelancer-chart')
  @ApiOperation({ summary: 'Freelancer Dashboard chart analysis' })
  @ApiQuery({
    name: 'day',
    required: false,
    type: String,
    example: '2025-06-28',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: String,
    example: '2025-06',
  })
  @ApiQuery({ name: 'year', required: false, type: String, example: '2025' })
  @ApiResponse({ status: 200, description: 'Analysis retrieved' })
  @ApiResponse({ status: 404, description: 'Analysis not found' })
  async findOne(@Query() query: any, @Req() req: any) {
    const data = await this.dashboardService.freelancerDashbaordAnalysis(
      query,
      req,
    );
    return successResponse({
      message: 'Analysis retrieved',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }
}
