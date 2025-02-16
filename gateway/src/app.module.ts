import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

import { UsersController } from './users.controller';
import { TasksController } from './tasks.controller';

import { AuthGuard } from './services/guards/authorization.guard';

import { ConfigService } from './services/config/config.service';
import { RolesGuard } from './services/guards/role.guard';
import { DefaultDatabaseConfiguration } from './orm.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv'
import { AuthRepository } from './repositories/auth.repository';
import { MetricsService } from './services/metrics.service';
dotenv.config()

@Module({
  imports: [DefaultDatabaseConfiguration(),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {expiresIn: process.env.ACCESS_TOKEN_DURATION},
    }),],
  controllers: [UsersController, TasksController],
  providers: [
    AuthRepository,
    ConfigService,
    MetricsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    {
      provide: 'USER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
    {
      provide: 'TASK_SERVICE',
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(configService.get('taskService'));
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
