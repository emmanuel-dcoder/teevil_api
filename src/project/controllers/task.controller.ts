import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { TaskService } from '../services/task.service';
import { Task } from '../schemas/task.schema';

import { successResponse } from 'src/config/response';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateTaskDto } from '../dto/create-project.dto';
import { UpdateTaskDto } from '../dto/update-project.dto';

@ApiTags('Tasks')
@Controller('api/v1/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task successfully created',
    type: Task,
  })
  @UseInterceptors(FilesInterceptor('files', 9))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Complete documentation' },
        content: { type: 'string', example: 'Task details' },
        priority: { type: 'string', enum: ['high', 'medium', 'low', 'casual'] },
        status: { type: 'string', enum: ['todo', 'in-progress', 'completed'] },
        section: { type: 'string', example: '613b6c3a5b41a2f123456789' },
        assignedTo: { type: 'array', items: { type: 'string' } },
        project: { type: 'string', example: '613b6c3a5b41a2f123456789' },
        dueDate: { type: 'string', format: 'date-time' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const data = await this.taskService.create(createTaskDto, files);
    return successResponse({
      message: 'Task successfully created',
      code: HttpStatus.CREATED,
      status: 'success',
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Fetch all tasks' })
  async fetchAll() {
    const data = await this.taskService.fetchAll();
    return successResponse({
      message: 'Tasks retrieved',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a task by ID' })
  async fetchOne(@Param('id') id: string) {
    const data = await this.taskService.fetchOne(id);
    return successResponse({
      message: 'Task retrieved',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @UseInterceptors(FilesInterceptor('files', 9))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const data = await this.taskService.update(id, updateTaskDto, files);
    return successResponse({
      message: 'Task updated',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  async delete(@Param('id') id: string) {
    const data = await this.taskService.delete(id);
    return successResponse({
      message: 'Task deleted',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }
}
