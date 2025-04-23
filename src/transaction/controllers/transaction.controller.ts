import {
  Controller,
  HttpStatus,
  UnauthorizedException,
  Req,
  Get,
  Query,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/config/response';
import { PaginationDto } from 'src/core/common/pagination/pagination';
import { TransactionService } from '../services/transaction.service';

@ApiTags('Transaction')
@Controller('api/v1/transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all transactions with search, pagination and status filter',
  })
  @ApiResponse({ status: 200, description: 'Transaction list' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'project name',
    description: 'Search query for transaction',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    example: 'pending',
    description:
      'Filter transactions by status (pending, paid, failed, in-review)',
  })
  async findAll(
    @Query() query: PaginationDto & { status?: string },
    @Req() req: any,
  ) {
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    const data = await this.transactionService.findAll(query, userId);

    return successResponse({
      message: 'Transaction lists',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a Stripe Payment' })
  async initiate(
    @Body()
    body: {
      freelancer: string;
      client: string;
      project: string;
      amount: number;
    },
  ) {
    const result = await this.transactionService.initiatePayment(body);
    return successResponse({
      message: 'Stripe payment initiated',
      code: HttpStatus.OK,
      status: 'success',
      data: result,
    });
  }

  @Get('verify/:paymentIntentId')
  @ApiOperation({ summary: 'Verify a Stripe Payment by PaymentIntent ID' })
  async verify(@Param('paymentIntentId') paymentIntentId: string) {
    const result = await this.transactionService.verifyPayment(paymentIntentId);
    return successResponse({
      message: 'Stripe payment verification result',
      code: HttpStatus.OK,
      status: 'success',
      data: result,
    });
  }
}
