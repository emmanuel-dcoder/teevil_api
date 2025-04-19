import mongoose from 'mongoose';
import { Invite } from '../schemas/invite.schema';

export enum projectType {
  shared = 'shared',
  client = 'client',
  personal = 'personal',
}

export type InviteWithProject = Invite & {
  projectId: {
    _id: mongoose.Types.ObjectId;
    title: string;
  };
};
