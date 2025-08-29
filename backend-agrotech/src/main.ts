import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupSwagger } from "./configs/swagger.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔹 Habilitar CORS
  app.enableCors({
    origin: "http://localhost:5173", //  tu frontend (React)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // si vas a manejar cookies o auth
  });

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
