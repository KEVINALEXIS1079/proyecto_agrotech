import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { CorreoService } from './correo.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('SMTP_PORT', 587),
          secure: false,
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"Recuperar contraseña Agrotech" <${configService.get('EMAIL_USER')}>`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [CorreoService],
  exports: [CorreoService],
})
export class CorreoModule {}
