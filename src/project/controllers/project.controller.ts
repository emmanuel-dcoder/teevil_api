import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  Req,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/config/response';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { PaginationDto } from 'src/core/common/pagination/paginaton';

@Controller('api/v1/project')
@ApiTags('Project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateProjectDto })
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user._id;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    const data = await this.projectService.createProject({
      ...createProjectDto,
      createdBy: userId,
    });

    return successResponse({
      message: 'Project created successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects with search and pagination' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'project name',
    description: 'Search query for project title',
  })
  async findAll(@Query() query: PaginationDto) {
    const data = await this.projectService.findAll(query);
    return successResponse({
      message: 'Projects retrieved successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async findOne(@Param('id') id: string) {
    const data = await this.projectService.findOne(id);
    return successResponse({
      message: 'Project retrieved successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async update(@Param('id') id: string, @Body() updateData: UpdateProjectDto) {
    const data = await this.projectService.update(id, updateData);
    return successResponse({
      message: 'Project updated successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async delete(@Param('id') id: string) {
    const data = await this.projectService.delete(id);
    return successResponse({
      message: 'Project deleted successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }
}
