import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/v1/chat')
@ApiTags('Real-time Socket Description (freelancers and clients)')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
}
