import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsArray,
  IsEmail,
  IsMongoId,
  ArrayNotEmpty,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { projectType } from '../enum/project.enum';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  projectType: projectType;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  deadline: Date;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  section: string[];
}

export class CreateSectionDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsMongoId()
  projectId: string;
}

export class CreateInviteDto {
  @IsEmail()
  email: string;

  @IsMongoId()
  projectId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  sections: string[];
}

export class CreateTaskDto {
  @ApiProperty({
    example: 'Complete documentation',
    description: 'Title of the task',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Detailed description of the task', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    example: 'medium',
    enum: ['high', 'medium', 'low', 'casual'],
    default: 'casual',
  })
  @IsOptional()
  @IsEnum(['high', 'medium', 'low', 'casual'])
  priority?: 'high' | 'medium' | 'low' | 'casual';

  @ApiProperty({
    example: 'todo',
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo',
  })
  @IsOptional()
  @IsEnum(['todo', 'in-progress', 'completed'])
  status?: 'todo' | 'in-progress' | 'completed';

  @ApiProperty({
    example: '613b6c3a5b41a2f123456789',
    description: 'Section ID',
  })
  @IsOptional()
  @IsMongoId()
  section?: string;

  @ApiProperty({
    example: ['613b6c3a5b41a2f123456789'],
    description: 'Assigned User IDs',
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  assignedTo: string[];

  @ApiProperty({
    example: '613b6c3a5b41a2f123456789',
    description: 'Project ID',
  })
  @IsNotEmpty()
  @IsMongoId()
  project: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2024-12-31',
    description: 'Due date of the task',
    required: false,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dueDate: Date;
}
