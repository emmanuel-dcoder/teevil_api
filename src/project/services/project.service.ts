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

      await this.sectionModel.insertMany(
        section.map((title) => ({
          title,
          project: new mongoose.Types.ObjectId(project._id),
        })),
      );

      return project;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async findAll() {
    try {
      return await this.projectModel.find();
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.projectModel.findById(id);
      if (!project) throw new NotFoundException('Project not found');
      return project;
    } catch (error) {
      throw new HttpException(error.message, 500);
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
