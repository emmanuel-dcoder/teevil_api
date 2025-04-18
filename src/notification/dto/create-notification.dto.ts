import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class CreeateNotificationDto {
  @ApiProperty({
    example: 'Job update',
    description: 'title of the notification',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'content of the notification' })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'user',
    description: `notitication user can be "user" or "admin"`,
  })
  @IsString()
  userType: string;

  @ApiProperty({
    example: true,
    description: 'boolean to confirm if notification has been read or not',
  })
  @IsBoolean()
  isRead?: boolean;
}
