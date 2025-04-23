import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  amount: number;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  client: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  freelancer: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Project', required: true })
  project: mongoose.Types.ObjectId;

  @Prop({
    default: 'pending',
    enum: ['pending', 'confirm', 'failed', 'in-reveiew'],
  })
  status: 'pending' | 'confirm' | 'failed' | 'in-review';

  @Prop({ required: false })
  method: string;

  @Prop({ required: false })
  paymentType: string;

  @Prop({ required: false })
  metaData: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
