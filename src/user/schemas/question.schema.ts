import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export class PrimarySkill {
  @Prop({ type: { type: String }, default: null })
  skill: string;

  @Prop({ type: { type: String }, default: null })
  interest: string;

  @Prop({ type: { type: String }, default: null })
  paymentReference: string;
}

class Bio {
  @Prop({ type: { type: String }, default: null })
  title: string;

  @Prop({ type: { type: String }, default: null })
  bio: string;
}

export type QuestionDocument = Question & Document;

@Schema({ timestamps: true })
export class Question {
  @Prop({ type: String })
  previousExperience: string;

  @Prop({ type: String })
  primarySkills: string;

  @Prop({ type: Bio })
  Bio: Bio;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
