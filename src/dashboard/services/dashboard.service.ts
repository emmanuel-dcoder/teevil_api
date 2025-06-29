import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from 'src/project/schemas/project.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
  ) {}

  async freelancerDashboardAnalysis(): Promise<any> {
    try {
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);

      const proposal = await this.projectModel.aggregate([
        {
          $match: {
            createdAt: { $gte: twelveMonthsAgo },
            status: 'completed',
          },
        },
        {
          $project: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
            status: 1,
          },
        },
        {
          $group: {
            _id: { month: '$month', year: '$year', status: '$status' },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.month': 1 },
        },
        {
          $addFields: {
            monthName: {
              $switch: {
                branches: [
                  { case: { $eq: ['$_id.month', 1] }, then: 'January' },
                  { case: { $eq: ['$_id.month', 2] }, then: 'February' },
                  { case: { $eq: ['$_id.month', 3] }, then: 'March' },
                  { case: { $eq: ['$_id.month', 4] }, then: 'April' },
                  { case: { $eq: ['$_id.month', 5] }, then: 'May' },
                  { case: { $eq: ['$_id.month', 6] }, then: 'June' },
                  { case: { $eq: ['$_id.month', 7] }, then: 'July' },
                  { case: { $eq: ['$_id.month', 8] }, then: 'August' },
                  { case: { $eq: ['$_id.month', 9] }, then: 'September' },
                  { case: { $eq: ['$_id.month', 10] }, then: 'October' },
                  { case: { $eq: ['$_id.month', 11] }, then: 'November' },
                  { case: { $eq: ['$_id.month', 12] }, then: 'December' },
                ],
                default: 'Unknown',
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            monthName: '$monthName',
            year: '$_id.year',
            status: '$_id.status',
            count: 1,
          },
        },
      ]);

      return proposal;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
