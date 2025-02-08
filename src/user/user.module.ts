import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailService } from 'src/core/mail/email';
import { Question, QuestionSchema } from './schemas/question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
