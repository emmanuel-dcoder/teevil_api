import {
  BadGatewayException,
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginDto,
  QuestionDto,
  VerifyOtpDto,
} from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import {
  AlphaNumeric,
  comparePassword,
  generateAccessToken,
  hashPassword,
  RandomSixDigits,
} from 'src/core/common/utils/authentication';
import { MailService } from 'src/core/mail/email';
import { Question } from './schemas/question.schema';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
    @InjectModel(Question.name) private questionModel: Model<Question>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const validateUser = await this.userModel.findOne({ email });

      if (validateUser) throw new BadGatewayException('Email already exist');

      const otp = RandomSixDigits();

      const hashedPassword = await hashPassword(password);

      const createUser = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
        verificationOtp: otp,
      });

      try {
        await this.mailService.sendMailNotification(
          email,
          'Welcome to Teevil',
          { name: createUserDto.firstName, otp },
          'welcome',
        );
      } catch (error) {
        console.log('email notification error:', error);
      }
      delete createUser.password;

      return createUser;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      if (!user || !(await comparePassword(dto.password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      if (!user.isVerified) {
        throw new BadRequestException(
          'Unverified user, kindly verify your account',
        );
      }
      const token = generateAccessToken({ userId: user._id });

      return {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async verifyOtp(dto: VerifyOtpDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });

      if (!user || user.verificationOtp !== dto.otp) {
        throw new BadRequestException('Invalid OTP');
      }

      user.isVerified = true;
      user.verificationOtp = null;
      await user.save();

      return { message: 'User verified successfully' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async resendOtp(email: string) {
    try {
      const user = await this.userModel.findOne({ email });

      if (!user) throw new BadRequestException('User not found');

      const otp = RandomSixDigits();
      user.verificationOtp = otp;
      await user.save();

      await this.mailService.sendMailNotification(
        email,
        'New OTP',
        { otp },
        'otp_resend',
      );
      return { message: 'New OTP sent to email' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    try {
      const user = await this.userModel.findOne({ email: dto.email });
      if (!user) throw new BadRequestException('User not found');
      //generate random password
      const dummyPassword = AlphaNumeric(6);
      const hashedPassword = await hashPassword(dummyPassword);
      user.password = hashedPassword;
      await user.save();
      await this.mailService.sendMailNotification(
        dto.email,
        'Forgot Password',
        { name: user.firstName, dummyPassword },
        'forgot-password',
      );

      return { message: 'Password reset OTP sent' };
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  /**
   * questions services
   */

  async updateQuestion(dto: QuestionDto, user: string) {
    const { ...restOfData } = dto;
    const validateUser = await this.userModel.findOne({
      _id: new mongoose.Types.ObjectId(user),
    });

    if (!validateUser) throw new BadRequestException('Invalid user id');

    const validateQuestion = await this.questionModel.findOne({
      user: new mongoose.Types.ObjectId(user),
    });
    if (validateQuestion) {
      const updateQuestion = await this.questionModel.findOneAndUpdate(
        { user: new mongoose.Types.ObjectId(user) },
        { ...restOfData },
        { new: true, runValidators: true, upsert: true },
      );
      if (!updateQuestion)
        throw new BadRequestException('Unable to update question');
      return updateQuestion;
    }
    const question = await this.questionModel.create({
      user: new mongoose.Types.ObjectId(user),
      ...restOfData,
    });

    if (!question) throw new BadRequestException('Unable to update question');

    return question;
  }

  async uploadProfilePicture(userId: string, file: Express.Multer.File) {
    try {
      const user = await this.userModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });
      if (!user) throw new NotFoundException('User not found');
      const uploadImage = await this.uploadUserImage(file);
      user.profileImage = uploadImage;

      await user.save();
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }

  private async uploadUserImage(file: Express.Multer.File | undefined) {
    try {
      if (!file) {
        return null;
      }
      const uploadedFile = await this.cloudinaryService.uploadFile(
        file,
        'profileImages',
      );
      return uploadedFile.url;
    } catch (error) {
      throw new HttpException(
        error?.response?.message ?? error?.message,
        error?.status ?? error?.statusCode ?? 500,
      );
    }
  }
}
