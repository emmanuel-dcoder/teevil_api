import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';

export class UpdateUserDto extends PartialType(CreateAdminDto) {}
