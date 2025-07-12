import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/env.config';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ProjectModule } from './project/project.module';
import { JobModule } from './job/job.module';
import { ProposalModule } from './proposal/propsal.module';
import { NotificationModule } from './notification/notification.module';
import { TransactionModule } from './transaction/transaction.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.database.mongo_url),
    AdminModule,
    UserModule,
    ProjectModule,
    JobModule,
    ProposalModule,
    NotificationModule,
    TransactionModule,
    WithdrawalModule,
    DashboardModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
