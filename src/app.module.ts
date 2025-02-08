import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/env.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot(config.database.mongo_url), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
