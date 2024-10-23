import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { ConfigService } from './services/config/config.service';
import * as dotenv from 'dotenv'
import {DefaultDatabaseConfiguration} from "./orm.module";
import {UserRepository} from "./repositories/user.repository";
import {AuthRepository} from "./repositories/auth.repository";
import {JwtModule} from '@nestjs/jwt'
dotenv.config()

@Module({
  imports: [DefaultDatabaseConfiguration(),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {expiresIn: process.env.ACCESS_TOKEN_DURATION},
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    ConfigService,
    UserRepository,
    AuthRepository,
    {
      provide: 'MAILER_SERVICE',
      useFactory: (configService: ConfigService) => {
        const mailerServiceOptions = configService.get('mailerService');
        return ClientProxyFactory.create(mailerServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class UserModule {}
