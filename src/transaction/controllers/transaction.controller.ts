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
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { PaginationDto } from 'src/core/common/pagination/pagination';
import { successResponse } from 'src/config/response';

@ApiTags('Transaction and Payment history')
@Controller('api/v1/transaction')
@ApiBearerAuth()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate a Stripe Payment' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 200, description: 'Stripe payment initiated' })
  async initiate(
    @Body() transactionDto: CreateTransactionDto,
    @Req() req: any,
  ) {
    const client = req.user?._id;
    const result = await this.transactionService.initiatePayment({
      client,
      ...transactionDto,
    });
    return successResponse({
      message: 'Stripe payment initiated',
      code: 200,
      status: 'success',
      data: result,
    });
  }

  @Get('verify/:paymentIntentId')
  @ApiOperation({ summary: 'Verify Stripe Payment by PaymentIntent ID' })
  async verify(@Param('paymentIntentId') paymentIntentId: string) {
    const result = await this.transactionService.verifyPayment(paymentIntentId);
    return successResponse({
      message: 'Stripe payment verification successful',
      code: 200,
      status: 'success',
      data: result,
    });
  }

  @Post('stripe-webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const result = await this.transactionService.stripeWebhook(
      req.rawBody,
      signature,
    );
    return result;
  }

  @Get()
  @ApiOperation({
    summary:
      'Get all transactions or payment history with search, pagination, and status filter',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({
    name: 'payoutStatus',
    required: false,
    type: String,
    enum: ['processing', 'paid'],
  })
  async findAll(
    @Query() query: PaginationDto & { payoutStatus?: string },
    @Req() req: any,
  ) {
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedException('User not authenticated');
    const data = await this.transactionService.findAll(query, userId);
    return successResponse({
      message: 'Transaction lists',
      code: 200,
      status: 'success',
      data,
    });
  }
}
