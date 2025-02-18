import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailService } from 'src/core/mail/email';
import { Question, QuestionSchema } from './schemas/question.schema';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import {
  QuestionTypeList,
  QuestionTypeListSchema,
} from './schemas/question-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: QuestionTypeList.name, schema: QuestionTypeListSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, MailService, CloudinaryService],
})
export class UserModule {}
