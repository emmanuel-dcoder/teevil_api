import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { WithdrawalMethod, WithdrawalStatus } from '../enum/withdrawal.enum';

export type WithdrawalDocument = Withdrawal & Document;

@Schema({ timestamps: true })
export class Withdrawal {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, type: String })
  transactionId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User', required: true })
  freelancer: mongoose.Types.ObjectId;

  @Prop({
    enum: WithdrawalStatus,
    default: WithdrawalStatus.pending,
  })
  status: WithdrawalStatus;

  @Prop({
    required: true,
    enum: WithdrawalMethod,
  })
  method: WithdrawalMethod;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);
