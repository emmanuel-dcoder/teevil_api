import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Query,
  Param,
  Headers,
  RawBodyRequest,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/core/common/pagination/pagination';
import { successResponse } from 'src/config/response';
import { WithdrawalService } from '../services/withdrawal.service';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';

@ApiTags('Withdrawal')
@Controller('api/v1/withdrawal')
@ApiBearerAuth()
export class WithdrawalController {
  constructor(private readonly withdrawalService: WithdrawalService) {}

  @Post('wallet')
  @ApiOperation({ summary: 'Request withdrawal' })
  @ApiBody({ type: CreateWithdrawalDto })
  @ApiResponse({ status: 200, description: 'Withdrawal request successful' })
  async initiate(
    @Body() createWithdrawalDto: CreateWithdrawalDto,
    @Req() req: any,
  ) {
    const freelancerId = req.user?._id;
    const result = await this.withdrawalService.requestWithdrawal({
      freelancerId,
      ...createWithdrawalDto,
    });
    return successResponse({
      message: 'Withdrawal request successful',
      code: 200,
      status: 'success',
      data: result,
    });
  }

  // @Get()
  // @ApiOperation({
  //   summary: 'Get all transactions with search, pagination, and status filter',
  // })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  // @ApiQuery({ name: 'limit', required: false, type: Number })
  // @ApiQuery({ name: 'search', required: false, type: String })
  // @ApiQuery({ name: 'status', required: false, type: String })
  // async findAll(
  //   @Query() query: PaginationDto & { status?: string },
  //   @Req() req: any,
  // ) {
  //   const userId = req.user?._id;
  //   if (!userId) throw new UnauthorizedException('User not authenticated');
  //   const data = await this.transactionService.findAll(query, userId);
  //   return successResponse({
  //     message: 'Transaction lists',
  //     code: 200,
  //     status: 'success',
  //     data,
  //   });
  // }
}
