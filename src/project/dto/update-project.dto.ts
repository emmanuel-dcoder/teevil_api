import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto, CreateSectionDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

export class UpdateSectionDto extends PartialType(CreateSectionDto) {}
