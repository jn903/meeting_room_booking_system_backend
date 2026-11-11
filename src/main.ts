import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor.js';
import { InvokeRecordInterceptor } from './invoke-record.interceptor.js';
import { UnloginFilter } from './unlogin.filter.js';
import {CustomExceptionFilter} from './custom-exception.filter.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('User Management API')
    .setDescription('API for managing users')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new UnloginFilter());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port') ?? 3000);
}
await bootstrap();
