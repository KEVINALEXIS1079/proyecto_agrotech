import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  setupSwagger,
  getSwaggerDocument,
  injectHtmlTitleMiddleware,
} from './configs/swagger.config';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 1 Inicializa Swagger y genera el documento
  setupSwagger(app);

  // 2️ Usa middleware para cambiar el <title> del HTML
  app.use('/api/v1/docs', injectHtmlTitleMiddleware());

  // 3 Monta Scalar con ese documento
  app.use(
    '/api/v1/docs',
    apiReference({
      content: getSwaggerDocument(),
      theme: {
        title: 'Agrotech API DOCS',
      },
    }),
  );

  await app.listen(3000);
}
bootstrap();
