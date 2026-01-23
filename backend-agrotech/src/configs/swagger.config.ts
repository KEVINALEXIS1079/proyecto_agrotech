import { INestApplication, RequestMethod } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let documentCache: any = null;

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Agrotech API')
    .setDescription('API REST Endpoints documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  documentCache = document;
};

//  Exportamos el documento para Scalar
export const getSwaggerDocument = () => {
  return documentCache;
};

//  Middleware para reemplazar <title> en el HTML de Scalar
export const injectHtmlTitleMiddleware = () => {
  return (req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
      if (typeof body === 'string') {
        body = body.replace(/<title>.*?<\/title>/, '<title>Agrotech API Docs</title>');
      }
      originalSend.call(this, body);
    };
    next();
  };
};
