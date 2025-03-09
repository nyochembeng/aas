import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // Enable validation globally
  app.useGlobalFilters(new HttpExceptionFilter()); // Use the custom error filter globally
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
