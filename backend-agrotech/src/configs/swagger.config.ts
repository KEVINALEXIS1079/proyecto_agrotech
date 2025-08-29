import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app:INestApplication)=>{

    
    const config = new DocumentBuilder()
    .setTitle('Agrotech API')
    .setDescription('Api Rest Enpoints documentation')
    .setVersion('1.0')
/*     .addTag('cats') */
    .build();
    
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, documentFactory);
};