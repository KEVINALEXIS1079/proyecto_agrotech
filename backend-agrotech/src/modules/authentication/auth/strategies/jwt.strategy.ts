import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from 'src/modules/usuario/usuarios/services/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    const { sub, correo, rol } = payload;

    if (!sub || !correo || !rol) {
      throw new UnauthorizedException('Payload JWT incompleto o inválido.');
    }

    // 🔹 Recuperar usuario desde base de datos con permisos
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

    const user = {
      id_usuario_pk: usuario.id_usuario_pk,
      correo_usuario: usuario.correo_usuario,
      rol: usuario.rol?.nombre_rol,
      permisos,
    };

    return user;
  }
}
