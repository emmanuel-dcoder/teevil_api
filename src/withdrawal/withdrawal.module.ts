import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyTokenMiddleware } from 'src/core/common/middlewares';
import { Withdrawal, WithdrawalSchema } from './schemas/withdrawal.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { WithdrawalController } from './controllers/withdrawal.controller';
import { WithdrawalService } from './services/withdrawal.service';
import { MailService } from 'src/core/mail/email';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Withdrawal.name, schema: WithdrawalSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [WithdrawalController],
  providers: [WithdrawalService, MailService],
})
export class WithdrawalModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes(WithdrawalController);
  }
}
