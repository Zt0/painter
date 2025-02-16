import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './services/config/config.service';
import { HttpExceptionFilter } from './filters/exception.filter';
import { quickstart } from './services/logger2';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('users')
    .addTag('tasks')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await quickstart()
  app.enableCors({origin: '*'})
  await app.listen(new ConfigService().get('api_gateway_port'));
}
bootstrap();
