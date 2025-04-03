import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../schemas/project.schema';
import { Section } from '../schemas/section.schema';
import { Task, TaskDocument } from '../schemas/task.schema';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { CreateTaskDto } from '../dto/create-project.dto';
import { UpdateTaskDto } from '../dto/update-project.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    files?: Array<Express.Multer.File>,
  ): Promise<Task> {
    try {
      const { content, ...restOfPayload } = createTaskDto;

      let taskImage;
      if (files) {
        taskImage = await this.uploadImages(files);
      }

      const task = await this.taskModel.create({
        ...restOfPayload,
        description: { content, image: taskImage ?? [] },
      });

      return task;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async fetchAll(): Promise<Task[]> {
    return this.taskModel.find().populate('project section assignedTo').exec();
  }

  async fetchOne(taskId: string): Promise<Task> {
    const task = await this.taskModel
      .findById(taskId)
      .populate('project section assignedTo')
      .exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(
    taskId: string,
    updateTaskDto: UpdateTaskDto,
    files?: Array<Express.Multer.File>,
  ): Promise<Task> {
    try {
      const existingTask = await this.taskModel.findById(taskId);
      if (!existingTask) {
        throw new NotFoundException('Task not found');
      }

      let taskImage = existingTask.description.image;
      if (files) {
        taskImage = await this.uploadImages(files);
      }

      const updatedTask = await this.taskModel.findByIdAndUpdate(
        taskId,
        {
          ...updateTaskDto,
          description: {
            content: updateTaskDto.content ?? existingTask.description.content,
            image: taskImage,
          },
        },
        { new: true },
      );

      return updatedTask;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async delete(taskId: string): Promise<{ message: string }> {
    const task = await this.taskModel.findByIdAndDelete(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return { message: 'Task successfully deleted' };
  }

  private async uploadImages(files: Array<Express.Multer.File> | undefined) {
    try {
      if (!files) return null;

      const uploadedFiles = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadFile(file, 'tasks')),
      );

      return uploadedFiles.map((uploadResult) => uploadResult.secure_url);
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
