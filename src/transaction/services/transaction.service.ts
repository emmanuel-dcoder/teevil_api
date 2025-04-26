import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';
import { StripePaymentIntentService } from 'src/provider/stripe/stripe-payment-intent.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { PaginationDto } from 'src/core/common/pagination/pagination';
import Stripe from 'stripe';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private readonly stripeService: StripePaymentIntentService,
  ) {}

  async initiatePayment(payload: CreateTransactionDto) {
    try {
      const { freelancer, client, project, amount } = payload;

      const stripePayment =
        await this.stripeService.createPaymentIntent(amount);

      const transaction = await this.transactionModel.create({
        freelancer: new mongoose.Types.ObjectId(freelancer),
        client: new mongoose.Types.ObjectId(client),
        project: new mongoose.Types.ObjectId(project),
        amount,
        channel: 'stripe',
        paymentType: 'card',
        metaData: JSON.stringify(stripePayment),
        status: 'pending',
        transactionId: stripePayment.id,
      });

      return {
        clientSecret: stripePayment.client_secret,
        paymentIntentId: stripePayment.id,
        transaction,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }

  async verifyPayment(paymentIntentId: string) {
    try {
      const payment =
        await this.stripeService.verifyPaymentIntent(paymentIntentId);

      const updated = await this.transactionModel.findOneAndUpdate(
        { transactionId: paymentIntentId },
        {
          status: payment.status === 'succeeded' ? 'confirmed' : 'failed',
        },
        { new: true },
      );

      return updated;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }

  async stripeWebhook(payload: Buffer, signature: string) {
    try {
      const event = this.stripeService.constructWebhookEvent(
        payload,
        signature,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
        case 'payment_intent.payment_failed':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.verifyPayment(paymentIntent.id);
          break;
      }

      return { received: true };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }

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
        error?.status ?? 500,
      );
    }
  }
}
