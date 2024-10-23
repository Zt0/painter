import { NestFactory } from '@nestjs/core';
import { TaskModule } from './task.module';
import { Transport, TcpOptions } from '@nestjs/microservices';

import { ConfigService } from './services/config/config.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(TaskModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 7002,
    },
  } as TcpOptions);
  await app.listen();
}
bootstrap();
