import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno.');
    }

    // Log condicional
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('🔐 JwtStrategy - Secret configurado:', secret);
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // Cambiado a true para manejar expiraciones manualmente si es necesario
      secretOrKey: secret,
    });

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('🔐 JwtStrategy configurado correctamente');
    }
  }

  async validate(payload: any) {
    // Log condicional
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('🔍 JWT Payload recibido:', JSON.stringify(payload, null, 2));
    }

    // Validar campos mínimos requeridos
    const sub = payload.sub || payload.id_usuario_pk;
    const correo = payload.correo || payload.correo_usuario;
    const rol = payload.rol;

    if (!sub || !correo || !rol) {
      throw new UnauthorizedException('Payload JWT incompleto. Faltan campos requeridos.');
    }

    // Construir usuario con permisos como array seguro
    const permisos = Array.isArray(payload.permisos) ? payload.permisos : [];
    const user = {
      sub,
      correo,
      rol,
      permisos,
    };

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('✅ Usuario construido:', JSON.stringify(user, null, 2));
    }

    return user;
  }
}