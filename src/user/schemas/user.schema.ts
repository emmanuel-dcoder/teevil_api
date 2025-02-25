import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { accountType, clientType } from '../enum/user.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ default: null })
  profileImage: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ type: String, enum: accountType, default: null })
  accountType: string;

  @Prop({ type: String, enum: clientType, default: null })
  clientType: string;

  @Prop({ required: false, default: null })
  verificationOtp: string;

  @Prop({ required: false, default: null })
  resetToken: string;

  @Prop({ default: null })
  resetTokenDate: Date;

  @Prop({ type: { type: mongoose.Types.ObjectId, ref: 'Question' } })
  question: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
