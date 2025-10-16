import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import {
  setupSwagger,
  getSwaggerDocument,
  injectHtmlTitleMiddleware,
} from './configs/swagger.config';
import { apiReference } from '@scalar/nestjs-api-reference';
import { setupAsyncApi } from './configs/asyncapi.config'; // 🔹 ojo: nombre en minúscula (setupAsyncApi)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =======================
  // 🌐 CONFIGURAR CORS
  // =======================
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // =======================
  // 🌍 PREFIJO GLOBAL
  // =======================
  app.setGlobalPrefix('api/v1');

  // =======================
  // ✅ VALIDACIÓN GLOBAL DTOs
  // =======================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // =======================
  // 📘 CONFIGURAR SWAGGER (Scalar)
  // =======================
  setupSwagger(app);

  // Middleware para cambiar el <title> de Scalar UI
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
  // ⚡ CONFIGURAR ASYNCAPI (WebSockets)
  // =======================
  await setupAsyncApi(app); // 🔹 función importada desde asyncapi.config.ts

  // =======================
  // 🚀 INICIAR SERVIDOR
  // =======================
  const PORT = 4000;
  await app.listen(PORT);

  console.log(`✅ REST Docs (Scalar): http://localhost:${PORT}/api/v1/docs`);
  console.log(`⚡ WebSocket Docs (AsyncAPI): http://localhost:${PORT}/asyncapi`);
}

bootstrap();
