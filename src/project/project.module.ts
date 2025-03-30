import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { VerifyTokenMiddleware } from 'src/core/common/middlewares';
import { Section, SectionSchema } from './schemas/section.schema';
import { Invite, InviteSchema } from './schemas/invite.schema';
import { MailService } from 'src/core/mail/email';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Invite.name, schema: InviteSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, MailService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyTokenMiddleware).forRoutes(ProjectController);
  }
}
