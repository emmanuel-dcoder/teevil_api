import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PaginationDto } from 'src/core/common/pagination/pagination';
import { Withdrawal } from '../schemas/withdrawal.schema';
import { CreateWithdrawalDto } from '../dto/create-withdrawal.dto';
import { User } from 'src/user/schemas/user.schema';
import { WithdrawalStatus } from '../enum/withdrawal.enum';
import { AlphaNumeric } from 'src/core/common/utils/authentication';
import { MailService } from 'src/core/mail/email';

@Injectable()
export class WithdrawalService {
  constructor(
    @InjectModel(Withdrawal.name) private withdrawalModel: Model<Withdrawal>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
  ) {}

  async requestWithdrawal(
    payload: CreateWithdrawalDto & { freelancerId: string },
  ) {
    try {
      const { freelancerId } = payload;

      //validate freelancer
      const freelancer = await this.userModel.findOne({
        _id: new mongoose.Types.ObjectId(freelancerId),
      });

      if (!freelancer) throw new BadRequestException('Invalid freelancer id');

      /**
       *
       * put a check to ascertain the wallet balance of the freelancer here before create or requesting withdrawal
       */

      /**
       * also make that transaction payout status is set to confirm once withrawal is successful
       */
      let transactionId;
      let validateTransactionId;

      do {
        transactionId = `TRX-${AlphaNumeric(5)}`;
        validateTransactionId = await this.withdrawalModel.findOne({
          transactionId,
        });
      } while (validateTransactionId);

      //create withdrawal
      const withdrawal = await this.withdrawalModel.create({
        freelancer: new mongoose.Types.ObjectId(freelancerId),
        status: WithdrawalStatus.review,
        transactionId,
        ...payload,
      });

      if (!withdrawal)
        throw new BadRequestException('Unable to complete withdrawal process');

      try {
        await this.mailService.sendMailNotification(
          freelancer.email,
          'Teevil: Withdrawal Request',
          { name: freelancer.firstName, amount: payload.amount },
          'withrawalRequest',
        );
      } catch (error) {
        console.log('mail error', error);
      }

      return withdrawal;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }

  async findFreelancerWithdrawal(
    query: PaginationDto & { status?: string },
    userId: string,
  ) {
    try {
      const { search, page = 1, limit = 10, status } = query;
      const skip = (page - 1) * limit;

      const filter: any = {
        $or: [{ client: userId }, { freelancer: userId }],
      };

      if (status) {
        filter.status = status;
      }

      if (search) {
        filter.$or.push(
          { paymentType: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
        );
      }

      const withdrawal = await this.withdrawalModel
        .find(filter)
        .populate({
          path: 'freelancer',
          model: 'User',
          select: 'firstName lastName profileImage email',
        })
        .skip(skip)
        .limit(limit);

      const total = await this.withdrawalModel.countDocuments(filter);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: withdrawal,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }

  async findAllWithdrawal(query: PaginationDto & { status?: string }) {
    try {
      const { search, page = 1, limit = 10, status } = query;
      const skip = (page - 1) * limit;

      const filter: any = {};

      if (status) {
        filter.status = status;
      }

      if (search) {
        filter.$or = [
          { paymentType: { $regex: search, $options: 'i' } },
          { status: { $regex: search, $options: 'i' } },
        ];
      }

      const withdrawal = await this.withdrawalModel
        .find(filter)
        .populate({
          path: 'freelancer',
          model: 'User',
          select: 'firstName lastName profileImage email',
        })
        .skip(skip)
        .limit(limit);

      const total = await this.withdrawalModel.countDocuments(filter);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: withdrawal,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? 500,
      );
    }
  }
}
