import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: [String] })
  responsibilities: string[];

  @Prop({ required: true })
  experience: string;

  @Prop({
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'all-types'],
    default: 'all-types',
  })
  jobType: 'full-time' | 'part-time' | 'contract' | 'all-types';

  @Prop({
    required: true,
    enum: ['hourly', 'daily', 'monthly', 'fixed'],
  })
  priceModel: 'hourly' | 'daily' | 'monthly' | 'fixed';

  @Prop({
    type: String,
    enum: ['pending', 'review', 'approved', 'open', 'closed'],
    default: 'open',
  })
  status: 'pending' | 'review' | 'approved' | 'open' | 'closed';

  @Prop({ type: Number, min: 0 })
  budget?: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  createdBy: mongoose.Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
