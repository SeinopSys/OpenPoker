import { CorrelationIdMiddleware } from '@eropple/nestjs-correlation-id';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { serverEnv } from './server-env';
import { createSessionMiddleware } from './utils/session-middleware';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const logger = app.get(Logger);
  app.use(await createSessionMiddleware(logger));

  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useLogger(logger);
  app.flushLogs();

  app.use(CorrelationIdMiddleware());

  const config = new DocumentBuilder()
    .setTitle('OpenPoker API')
    .setDescription('API documentation for OpenPoker')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverEnv.PORT);
  return app;
}
