import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type InviteDocument = Invite & Document;

@Schema({ timestamps: true })
export class Invite {
  @Prop({ required: true })
  email: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  projectId: mongoose.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Section' }] })
  sections: mongoose.Types.ObjectId[];
}

export const InviteSchema = SchemaFactory.createForClass(Invite);
