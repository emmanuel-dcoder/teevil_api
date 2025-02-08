import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Experience } from '../enum/user.enum';

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

export class PrimarySkillDto {
  @ApiProperty()
  @IsString()
  skill: string;

  @ApiProperty()
  @IsString()
  interest: string;

  @ApiProperty()
  @IsString()
  paymentReference: string;
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
  previousExperience: Experience;

  @ApiPropertyOptional()
  primarySkills: PrimarySkillDto;

  @ApiPropertyOptional()
  Bio: BioDto;
}
