import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifyTokenMiddleware } from 'src/core/common/middlewares';
import { Project, ProjectSchema } from 'src/project/schemas/project.schema';
import { DashboardController } from './controllers/dashboard.controller';
import { ProjectService } from 'src/project/services/project.service';
import { DashboardService } from './services/dashboard.service';
import { Section, SectionSchema } from 'src/project/schemas/section.schema';
import { Invite, InviteSchema } from 'src/project/schemas/invite.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import {
  Notification,
  NotificationSchema,
} from 'src/notification/schemas/notification.schema';
import { NotificationService } from 'src/notification/services/notification.service';
import { MailService } from 'src/core/mail/email';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Invite.name, schema: InviteSchema },
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    ProjectService,
    DashboardService,
    NotificationService,
    MailService,
  ],
})
export class DashboardModule {}
