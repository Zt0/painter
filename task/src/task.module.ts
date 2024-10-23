import { Module } from '@nestjs/common';

import { TaskController } from './task.controller';
import { TaskService } from './services/task.service';
import { DefaultDatabaseConfiguration } from './orm.module';
import {JwtModule} from '@nestjs/jwt'
import * as dotenv from 'dotenv'
dotenv.config()

@Module({
  imports: [
    DefaultDatabaseConfiguration(),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {expiresIn: process.env.ACCESS_TOKEN_DURATION},
    })],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
