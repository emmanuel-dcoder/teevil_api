import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestionType } from '../enum/user.enum';

export type QuestionListDocument = QuestionTypeList & Document;

@Schema({ timestamps: true })
export class QuestionTypeList {
  @Prop({ type: String, enum: QuestionType })
  type: string;

  @Prop({ type: String })
  experience: string;

  @Prop({ type: String })
  skill: string;

  @Prop({ type: String })
  interest: string;

  @Prop({ type: String })
  paymentType: string;
}

export const QuestionTypeListSchema =
  SchemaFactory.createForClass(QuestionTypeList);
