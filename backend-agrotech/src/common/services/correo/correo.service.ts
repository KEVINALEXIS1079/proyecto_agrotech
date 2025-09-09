import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CorreoService {
  private readonly logger = new Logger(CorreoService.name);

  constructor(private readonly mailerService: MailerService) {}

  async enviarCodigoRecuperacion(email: string, codigo: string, nombre: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Código de recuperación de contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Recuperación de contraseña</h2>
            <p>Hola ${nombre},</p>
            <p>Tu código de recuperación es:</p>
            <div style="background: #f0f0f0; padding: 10px; text-align:center; font-size: 24px; font-weight:bold;">
              ${codigo}
            </div>
            <p>Este código expirará en 10 minutos.</p>
          </div>
        `,
      });
      this.logger.log(`Correo de recuperación enviado a: ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error enviando correo:', error.message);
      throw new Error('No se pudo enviar el correo de recuperación');
    }
  }
}
