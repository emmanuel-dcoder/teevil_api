import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Experience } from '../enum/user.enum';

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
  @Prop({ type: String, enum: Experience, default: Experience.new })
  previousExperience: string;

  @Prop({ type: PrimarySkill })
  primarySkills: PrimarySkill;

  @Prop({ type: Bio })
  Bio: Bio;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
