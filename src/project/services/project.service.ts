import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { CreateProjectDto } from '../dto/create-project.dto';
import { Section } from '../schemas/section.schema';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { PaginationDto } from 'src/core/common/pagination/paginaton';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Section.name) private sectionModel: Model<Section>,
  ) {}

  async createProject(payload: CreateProjectDto & { createdBy: string }) {
    try {
      const { createdBy, title, description, deadline, section, projectType } =
        payload;

      const validateProject = await this.projectModel.findOne({
        createdBy: new mongoose.Types.ObjectId(createdBy),
        title,
      });

      if (validateProject)
        throw new BadRequestException('Project with the title already exists');

      const project = await this.projectModel.create({
        createdBy: new mongoose.Types.ObjectId(createdBy),
        title,
        description,
        deadline,
        projectType,
      });

      if (!project) throw new BadRequestException('Unable to create project');

      const sections = await this.sectionModel.insertMany(
        section.map((title) => ({
          title,
          project: new mongoose.Types.ObjectId(project._id),
        })),
      );

      const sectionIds = sections.map((sec) => sec._id);
      project.sections = sectionIds;
      await project.save();

      return project;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async findAll(query: PaginationDto) {
    try {
      const { search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      const projects = await this.projectModel
        .find(filter)
        .populate('sections')
        .skip(skip)
        .limit(limit);

      const total = await this.projectModel.countDocuments(filter);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: projects,
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
      const project = await this.projectModel.findById(id).populate({
        path: 'sections',
        populate: {
          path: 'tasks',
        },
      });
      if (!project) throw new NotFoundException('Project not found');
      return project;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async update(id: string, updateData: UpdateProjectDto) {
    try {
      const updatedProject = await this.projectModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );
      if (!updatedProject) throw new NotFoundException('Project not found');
      return updatedProject;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async delete(id: string) {
    try {
      const deletedProject = await this.projectModel.findByIdAndDelete(id);
      if (!deletedProject) throw new NotFoundException('Project not found');
      return { message: 'Project deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
