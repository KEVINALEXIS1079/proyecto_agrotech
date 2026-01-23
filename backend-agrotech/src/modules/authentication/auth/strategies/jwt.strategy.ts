import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from 'src/modules/usuario/usuarios/services/usuarios.service';
import { TokenRedisService } from '../services/token-redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
    private readonly tokenRedisService: TokenRedisService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true, // Permite acceder al request para extraer el token
    });
  }

  /**
   * Se ejecuta automáticamente al validar un JWT en cualquier ruta protegida.
   */
  async validate(req: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    if (!token) {
      throw new UnauthorizedException('No se encontró token en la cabecera.');
    }

    // 🔹 Verificar si el token está en la blacklist (logout o revocado)
    const isBlacklisted = await this.tokenRedisService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token inválido (en blacklist). Debes iniciar sesión nuevamente.');
    }

    // 🔹 (Opcional) También puedes verificar si el token expiró en Redis si lo deseas
    const existsInRedis = await this.tokenRedisService.isActive(token);
    if (!existsInRedis) {
      // Esto ayuda si Redis se usa como único control de sesión activa
      throw new UnauthorizedException('Sesión expirada o token no reconocido.');
    }

    const { sub, correo, rol } = payload;
    if (!sub || !correo) {
      throw new UnauthorizedException('Payload JWT incompleto o inválido.');
    }

    // 🔹 Recuperar usuario con sus permisos actualizados desde la BD
    const usuario = await this.usuariosService.findByIdConPermisos(sub);
    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo.');
    }

    // 🔹 Reconstruir estructura esperada por los guards
    const permisos = [
      ...(usuario.rol?.permisos || []),
      ...(usuario.permisos || []),
    ]
      .filter((p: any) => p.module?.nombre && p.accion && p.activo)
      .map((p: any) => `${p.module.nombre}:${p.accion}`);

    // 🔹 Este objeto será inyectado en req.user
    return {
      id_usuario_pk: usuario.id_usuario_pk,
      correo_usuario: usuario.correo_usuario,
      rol: usuario.rol?.nombre_rol,
      permisos,
    };
  }
}
