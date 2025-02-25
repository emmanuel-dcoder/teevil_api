import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { QuestionType } from '../enum/user.enum';

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
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  accountType: string;
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

export class QuestionDto {
  @ApiPropertyOptional()
  previousExperience: string;

  @ApiPropertyOptional()
  primarySkills: string;

  @ApiPropertyOptional()
  Bio: BioDto;
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
