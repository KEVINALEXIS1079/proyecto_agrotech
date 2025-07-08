import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Esto es obligatorio para que los DTOs se validen
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remueve campos que no están en el DTO
    forbidNonWhitelisted: true, // lanza error si llega un campo no permitido
    transform: true, // convierte tipos automáticamente (string -> number, etc.)
  }));

  await app.listen(3000);
}
bootstrap();
