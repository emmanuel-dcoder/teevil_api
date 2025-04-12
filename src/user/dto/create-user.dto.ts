import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { accountType, ClientType, QuestionType } from '../enum/user.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  accountType: accountType;
}

export class VerifyOtpDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  // @Length(4, 4)
  otp: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class BioDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  bio: string;
}
export class ClientTypeDto {
  @ApiProperty()
  @IsString()
  clientType: ClientType;
}

export class QuestionDto {
  @ApiPropertyOptional()
  previousExperience: string;

  @ApiPropertyOptional()
  primarySkills: string;

  @ApiPropertyOptional()
  interest: string;

  @ApiPropertyOptional()
  paymentType: string;

  @ApiPropertyOptional()
  hireType: string;

  @ApiPropertyOptional()
  projectSize: string;

  @ApiPropertyOptional()
  agencyStaffNo: string;

  @ApiPropertyOptional()
  budget: string;

  @ApiPropertyOptional()
  workPreference: string;

  @ApiPropertyOptional()
  typeOfProject: string;

  @ApiPropertyOptional()
  bio: string;

  @ApiPropertyOptional()
  title: string;
}

export class QuestionTypeListDto {
  @ApiProperty()
  @IsString()
  type: QuestionType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  experience: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  skill: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interest: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  hireType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectSize: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  agencyStaffNo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  budget: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  workPreference: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  typeOfProject: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @IsString()
  newPassword: string;
}

export class DeleteAccountDto {
  @ApiProperty()
  @IsString()
  password: string;
}

export class UpdateVisibleDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  visible: boolean;
}
