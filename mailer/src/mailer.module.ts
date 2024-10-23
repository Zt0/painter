import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerController } from './mailer.controller';
import { ConfigService } from './services/config/config.service';
import {EjsAdapter} from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_API_KEY,
          pass: process.env.MAILER_SERVICE_API_KEY,
        },
      },
      template: {
        adapter: new EjsAdapter(),
        options: {strict: false},
      },
    }),
  ],
  providers: [ConfigService],
  controllers: [MailerController],
})
export class AppMailerModule {}
