import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { VerifyTokenMiddleware } from 'src/core/common/middlewares';
import { Section, SectionSchema } from './schemas/section.schema';
import { Invite, InviteSchema } from './schemas/invite.schema';
import { MailService } from 'src/core/mail/email';
import { SectionController } from './controllers/section.controller';
import { SectionService } from './services/section.service';
import { Task, TaskSchema } from './schemas/Task.schema';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import { CloudinaryService } from 'src/core/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Invite.name, schema: InviteSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [ProjectController, SectionController, TaskController],
  providers: [
    ProjectService,
    MailService,
    SectionService,
    TaskService,
    CloudinaryService,
  ],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware)
      .forRoutes(ProjectController, SectionController, TaskController);
  }
}
