import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsMongoId, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: '662aa983714edbe3f503616c',
    description: 'id of the freelancer',
  })
  @IsString()
  @IsMongoId()
  freelancer: string;

  @ApiProperty({
    example: '662aa983714edbe3f503616c',
    description: 'id of the project',
  })
  @IsString()
  @IsMongoId()
  project: string;

  @ApiProperty({
    example: 700,
    description: 'amount intended to pay',
    type: Number,
  })
  @IsNumber()
  amount: number;
}
