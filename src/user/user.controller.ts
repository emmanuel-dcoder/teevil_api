import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Query,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginDto,
  QuestionDto,
  QuestionTypeListDto,
  VerifyOtpDto,
} from './dto/create-user.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { successResponse } from 'src/config/response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/v1/user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('questions')
  @ApiOperation({
    summary: 'Post Questions',
  })
  @ApiBody({ type: QuestionTypeListDto })
  @ApiResponse({ status: 200, description: 'Question created successfully' })
  @ApiResponse({ status: 401, description: 'Unable to create Question' })
  async createQuestion(@Body() questionTypeListDto: QuestionTypeListDto) {
    const data = await this.userService.createQuestion(questionTypeListDto);
    return successResponse({
      message: 'Question created successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Get('questions')
  @ApiOperation({
    summary: 'Get questions based on type on params',
  })
  @ApiQuery({
    name: 'type',
    required: true,
    description: 'Fetch questions based on type',
    type: String,
    example: `e.g experience, paymentType, interest, primarySkill`,
  })
  @ApiResponse({ status: 200, description: 'Question retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unable to retrieve questions' })
  async fetchQuestions(@Query('type') type: string) {
    const data = await this.userService.fetchQuestion(type);
    return successResponse({
      message: 'Question retrieved successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post()
  @ApiOperation({
    summary: 'Create User',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'User created successfully' })
  @ApiResponse({ status: 401, description: 'Unable to create user' })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    return successResponse({
      message: 'User created successfully',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post('login')
  @ApiOperation({
    summary: 'User Login',
    description: 'Logs in the user and returns a JWT token.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful. Returns JWT token.',
  })
  @ApiResponse({ status: 400, description: 'Invalid email or password.' })
  async login(@Body() dto: LoginDto) {
    const data = await this.userService.login(dto);
    return successResponse({
      message: 'Login successful.',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP',
    description:
      'Verifies the OTP sent to the user email and activates the account.',
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'User verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP.' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    const data = await this.userService.verifyOtp(dto);
    return successResponse({
      message: 'User verified successfully.',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post('resend-otp')
  @ApiOperation({
    summary: 'Resend OTP',
    description: 'Sends a new OTP to the user’s email for verification.',
  })
  @ApiBody({
    schema: {
      properties: { email: { type: 'string', example: 'user@example.com' } },
    },
  })
  @ApiResponse({ status: 200, description: 'New OTP sent to email.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async resendOtp(@Body('email') email: string) {
    const data = await this.userService.resendOtp(email);
    return successResponse({
      message: 'New OTP sent to email.',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot Password',
    description: 'Requests a password reset OTP via email.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset OTP sent.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const data = await this.userService.forgotPassword(dto);
    return successResponse({
      message: 'Password reset OTP sent.',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Put('update-question/:id')
  @ApiOperation({
    summary: 'Update Question',
    description: 'Updates or creates a user question entry.',
  })
  @ApiBody({ type: QuestionDto })
  @ApiResponse({ status: 200, description: 'Question updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async updateQuestion(@Param('id') user: string, @Body() dto: any) {
    const data = await this.userService.updateQuestion(dto, user);
    return successResponse({
      message: 'Question updated successfully.',
      code: HttpStatus.OK,
      status: 'success',
      data,
    });
  }

  @Put(':id/profile-picture')
  @ApiOperation({
    summary: 'Upload profile picture for the user, use form data (Key: file)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile picture uploaded successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException(
        'Image file not upload, format must be JPEG/JPG',
      );
    await this.userService.uploadProfilePicture(userId, file);
    return successResponse({
      message: 'Profile picture uploaded successfully',
      code: HttpStatus.OK,
      status: 'success',
    });
  }
}
