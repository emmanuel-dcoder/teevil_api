import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PaginationDto } from 'src/core/common/pagination/pagination';
import { MailService } from 'src/core/mail/email';
import { Job } from '../schemas/job.schema';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<Job>,
    private readonly mailService: MailService,
  ) {}

  async createJob(payload: CreateJobDto & { createdBy: string }) {
    const { title, createdBy } = payload;

    try {
      const existingJob = await this.jobModel.findOne({
        createdBy: new mongoose.Types.ObjectId(createdBy),
        status: 'open',
        title,
      });

      if (existingJob) {
        throw new BadRequestException(
          'An open job with a similar title already exists',
        );
      }

      const job = await this.jobModel.create({
        ...payload,
        createdBy: new mongoose.Types.ObjectId(createdBy),
      });

      if (!job) {
        throw new BadRequestException('Unable to create the job');
      }

      return job;
    } catch (error) {
      throw new HttpException(
        error?.message || 'Internal server error',
        error?.status || 500,
      );
    }
  }

  async findAll(query: PaginationDto) {
    try {
      const { search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      let filter: any = {};
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      const jobs = await this.jobModel.find(filter).skip(skip).limit(limit);

      const total = await this.jobModel.countDocuments(filter);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: jobs,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const job = await this.jobModel.findById(id);
      if (!job) throw new NotFoundException('Job not found');
      return job;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async update(id: string, updateData: UpdateJobDto) {
    try {
      const job = await this.jobModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!job) throw new NotFoundException('Job not found');
      return job;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async delete(id: string) {
    try {
      const job = await this.jobModel.findByIdAndDelete(id);
      if (!job) throw new NotFoundException('Job not found');
      return { message: 'Job deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
