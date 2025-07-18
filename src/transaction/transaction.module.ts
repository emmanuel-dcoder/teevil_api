import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
    consumer.apply(VerifyTokenMiddleware).forRoutes(TransactionController);
  }
}
