import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'tu_clave_secreta', // debe ser la misma clave que en el módulo JwtModule
    });
  }

  async validate(payload: any) {
    return {
      id_usuario_pk: payload.sub,
      correo_usuario: payload.correo_usuario,
      rol: { nombre_rol: payload.rol }, // para que coincida con req.user.rol.nombre_rol
    };
  }

  
}
