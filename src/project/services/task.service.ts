import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SubTask, Task } from '../schemas/task.schema';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';
import { CreateTaskDto, UpdateSubTaskDto } from '../dto/create-project.dto';
import { UpdateTaskDto } from '../dto/update-project.dto';
import { PaginationDto } from 'src/core/common/pagination/pagination';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(SubTask.name) private subTaskModel: Model<SubTask>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    files?: Array<Express.Multer.File>,
  ): Promise<Task> {
    try {
      const { content, tasks, section, project, assignedTo, ...restOfPayload } =
        createTaskDto;

      let taskImage;
      if (files) {
        taskImage = await this.uploadImages(files);
      }

      let subTaskIds: mongoose.Types.ObjectId[] = [];

      if (tasks?.length) {
        const createdSubTasks = await this.subTaskModel.insertMany(
          tasks.map((title) => ({ subTitle: title })),
        );
        subTaskIds = createdSubTasks.map(
          (subTask) => new mongoose.Types.ObjectId(subTask._id),
        );
      }

      const assignedUserIds = assignedTo.map(
        (id) => new mongoose.Types.ObjectId(id),
      );

      const task = await this.taskModel.create({
        ...restOfPayload,
        project: new mongoose.Types.ObjectId(project),
        section: new mongoose.Types.ObjectId(section),
        assignedTo: assignedUserIds,
        description: { content, image: taskImage ?? [] },
        subTasks: subTaskIds,
      });

      return task;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async updateSubTask(updateSubTaskDto: UpdateSubTaskDto): Promise<SubTask> {
    try {
      const task = await this.taskModel.findById(updateSubTaskDto.taskId);

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (!task.subTasks || task.subTasks.length === 0) {
        throw new BadRequestException('Task has no subtasks assigned');
      }

      const subTaskIds = task.subTasks.map((id) => id.toString());

      const isSubTaskLinked = subTaskIds.includes(
        updateSubTaskDto.subTaskId.toString(),
      );

      if (!isSubTaskLinked) {
        throw new BadRequestException(
          'Subtask is not associated with the given task',
        );
      }

      const { taskId, subTaskId, ...restOfPayload } = updateSubTaskDto;

      const subTask = await this.subTaskModel.findByIdAndUpdate(
        subTaskId,
        { ...restOfPayload },
        { new: true },
      );

      if (!subTask) {
        throw new NotFoundException('Subtask not found');
      }

      return subTask;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async fetchAll(query: PaginationDto, sectionId: string, status?: string) {
    try {
      const { search, page = 1, limit = 10 } = query;
      const skip = (page - 1) * limit;

      let filter: any = { section: new mongoose.Types.ObjectId(sectionId) };

      // Add a filter for the status if it is provided
      if (status) {
        filter.status = status; // This will filter tasks based on the status
      }

      // If a search query is provided, add it to the filter
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }

      const data = await this.taskModel
        .find(filter)
        .populate({
          path: 'section',
          model: 'Section',
        })
        .populate({
          path: 'subTasks',
          model: 'SubTask',
          select: 'subTitle status profileImage email',
        })
        .populate({
          path: 'assignedTo',
          model: 'User',
          select: 'firstName lastName',
        })
        .populate({
          path: 'project',
          model: 'Project',
        })
        .skip(skip)
        .limit(limit);

      // Count the total number of tasks that match the filter criteria
      const total = await this.taskModel.countDocuments(filter);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async fetchOne(taskId: string): Promise<Task> {
    try {
      const task = await this.taskModel
        .findById(taskId)
        .populate({
          path: 'section',
          model: 'Section',
        })
        .populate({
          path: 'subTasks',
          model: 'SubTask',
          select: 'subTitle status',
        })
        .populate({
          path: 'assignedTo',
          model: 'User',
        })
        .populate({
          path: 'project',
          model: 'Project',
        });

      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return task;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
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
    try {
      const task = await this.taskModel.findByIdAndDelete(taskId);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return { message: 'Task successfully deleted' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async deleteSubTask(subTaskId: string): Promise<{ message: string }> {
    try {
      const subTask = await this.subTaskModel.findByIdAndDelete(subTaskId);
      if (!subTask) {
        throw new NotFoundException('Subtask not found');
      }
      return { message: 'Subtask successfully deleted' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
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
