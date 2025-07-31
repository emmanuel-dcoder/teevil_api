import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyTokenMiddleware } from 'src/core/common/middlewares';
import { TransactionController } from './controllers/transaction.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionService } from './services/transaction.service';

import { StripePaymentIntentService } from 'src/provider/stripe/stripe-payment-intent.service';
import { Project, ProjectSchema } from 'src/project/schemas/project.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, StripePaymentIntentService],
})
export class TransactionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes(
      {
        path: 'api/v1/transaction/initiate',
        method: RequestMethod.POST,
      },
      {
        path: 'api/v1/transaction/verify/:paymentIntentId',
        method: RequestMethod.GET,
      },
      {
        path: 'api/v1/transaction',
        method: RequestMethod.GET,
      },
      {
        path: 'api/v1/transaction/escrow',
        method: RequestMethod.GET,
      },
    );
  }
}
