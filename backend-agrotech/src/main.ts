import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  setupSwagger,
  getSwaggerDocument,
  injectHtmlTitleMiddleware,
} from './configs/swagger.config';
import { apiReference } from '@scalar/nestjs-api-reference';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // =======================
  // SERVIR ARCHIVOS ESTÁTICOS (uploads)
  // =======================
  //  Usar process.cwd() en lugar de __dirname, porque Nest compila a /dist
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // =======================
  // CONFIGURAR CORS
  // =======================
  app.enableCors({
    origin: ['http://localhost:3000'], // se puede expandir con más dominios
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // =======================
  // PREFIJO GLOBAL
  // =======================
  app.setGlobalPrefix('api/v1');

  // =======================
  // VALIDACIÓN GLOBAL DTOs
  // =======================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Convierte strings a números/booleanos
      },
    }),
  );

  // =======================
  // CONFIGURAR SWAGGER (Scalar)
  // =======================
  setupSwagger(app);

  // Cambiar el <title> de Scalar UI
  app.use('/api/v1/docs', injectHtmlTitleMiddleware());

  // UI de Scalar (REST)
  app.use(
    '/api/v1/docs',
    apiReference({
      content: getSwaggerDocument(),
      theme: {
        title: 'Agrotech API DOCS',
      },
    }),
  );

  // =======================
  // INICIAR SERVIDOR
  // =======================
  const PORT = 4000;
  await app.listen(PORT);

  console.log(` REST Docs (Scalar): http://localhost:${PORT}/api/v1/docs`);
  console.log(` Servidor corriendo en: http://localhost:${PORT}`);
  console.log(` Archivos disponibles en: http://localhost:${PORT}/uploads`);
}

bootstrap();