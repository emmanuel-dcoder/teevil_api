import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PaginationDto } from 'src/core/common/pagination/pagination';
import { Transaction } from '../schemas/transaction.schema';
import { StripePaymentIntentService } from 'src/provider/stripe/stripe-payment-intent.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly stripeService: StripePaymentIntentService,
  ) {}

  async findAll(
    query: PaginationDto & { status?: string; search?: string },
    userId: string,
  ) {
    try {
      const { search, page = 1, limit = 10, status } = query;
      const skip = (page - 1) * limit;

      const filter: any = {
        $or: [{ client: userId }, { freelancer: userId }],
      };

      if (status) {
        filter.status = status;
      }

      if (search) {
        filter.$or.push(
          { method: { $regex: search, $options: 'i' } },
          { paymentType: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
        );
      }

      const transactions = await this.transactionModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate('client freelancer project');

      const total = await this.transactionModel.countDocuments(filter);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: transactions,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async initiatePayment(payload: {
    freelancer: string;
    client: string;
    project: string;
    amount: number;
  }) {
    try {
      const { freelancer, client, project, amount } = payload;

      const metadata = { freelancer, client, project };

      const stripePayment = await this.stripeService.createPaymentIntent(
        amount,
        metadata,
      );

      const transaction = await this.transactionModel.create({
        freelancer,
        client,
        project,
        amount,
        method: 'stripe',
        paymentType: 'card',
        metaData: JSON.stringify(metadata),
        status: 'pending',
      });

      return {
        clientSecret: stripePayment.client_secret,
        transaction,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async verifyPayment(paymentIntentId: string) {
    try {
      const payment =
        await this.stripeService.verifyPaymentIntent(paymentIntentId);

      const updated = await this.transactionModel.findOneAndUpdate(
        { metaData: { $regex: paymentIntentId } },
        {
          status: payment.status === 'succeeded' ? 'confirm' : 'failed',
        },
        { new: true },
      );

      return updated;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
