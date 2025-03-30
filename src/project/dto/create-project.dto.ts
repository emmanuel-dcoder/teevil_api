import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsArray,
  IsEmail,
  IsMongoId,
  ArrayNotEmpty,
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
