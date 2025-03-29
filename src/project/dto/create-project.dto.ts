import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, IsArray } from 'class-validator';
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
  @Type(() => Date) // Converts incoming string to a Date instance
  deadline: Date;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  section: string[];
}
