import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'AI Engineer', description: 'title of job ' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'details of the job' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['first response', 'second response'] })
  @IsArray()
  @IsString({ each: true })
  responsibities: string[];

  @ApiProperty({
    example: '2 years experience',
    description: 'experience needed for the job',
  })
  @IsString()
  experience: string;

  @ApiProperty({
    example: 'all-types',
    enum: ['full-time', 'part-time', 'contract', 'all-types'],
  })
  @IsString()
  jobType: string;

  @ApiProperty({
    example: 'all-type',
    enum: ['hourly', 'daily', 'monthly', 'fixed'],
  })
  @IsString()
  priceModel: string;

  @ApiProperty({
    example: 'review',
    enum: ['pending', 'review', 'approved', 'open', 'closed'],
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 67 })
  @IsOptional()
  @IsNumber()
  budget: number;
}
