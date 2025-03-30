import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { CreateSectionDto } from '../dto/create-project.dto';
import { Section } from '../schemas/section.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Section.name) private sectionModel: Model<Section>,
  ) {}

  async createSection(payload: CreateSectionDto) {
    try {
      const { title, projectId } = payload;

      const [validateSection, validateProject] = await Promise.all([
        await this.sectionModel.findOne({
          title,
          project: new mongoose.Types.ObjectId(projectId),
        }),

        await this.projectModel.findOne({
          _id: new mongoose.Types.ObjectId(projectId),
        }),
      ]);

      if (validateSection || !validateProject)
        throw new BadRequestException(
          'Section already exist or Invalid project',
        );

      const section = await this.sectionModel.create({
        title,
        project: new mongoose.Types.ObjectId(projectId),
      });

      if (!section) throw new BadRequestException('Unable to create section');
      await this.projectModel.findByIdAndUpdate(
        { project: new mongoose.Types.ObjectId(projectId) },
        {
          $push: { sections: section._id },
        },
      );

      return section;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
