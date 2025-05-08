import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateWithdrawalDto {
  @ApiProperty({
    example: 700,
    description: 'amount intended to withdrawal',
    type: Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'bank-transfer',
  })
  @IsString()
  method: string;
}
