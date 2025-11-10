import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/modules/usuario/usuarios/services/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno.');
    }
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('AuthService - JWT Secret configurado:', secret);
    }
  }

  async validateUser(correo: string, contrasena: string) {
    const usuario = await this.usuariosService.findByCorreoConPermisos(correo);
    if (!usuario) {
      if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
        console.log('Usuario no encontrado:', correo);
      }
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const isPasswordValid = await bcrypt.compare(contrasena, usuario.contrasena_usuario);
    if (!isPasswordValid) {
      if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
        console.log('Contraseña inválida para usuario:', correo);
      }
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('Usuario validado correctamente:', correo);
    }

    return usuario;
  }

  private getPermisosUsuario(usuario: any): string[] {
    const permisosRol =
      usuario.rol?.permisos
        ?.filter((p: any) => p.module?.nombre && p.accion && p.activo)
        .map((p: any) => `${p.module.nombre}:${p.accion}`) || [];

    const permisosDirectos =
      usuario.permisos
        ?.filter((p: any) => p.module?.nombre && p.accion && p.activo)
        .map((p: any) => `${p.module.nombre}:${p.accion}`) || [];

    return Array.from(new Set([...permisosRol, ...permisosDirectos]));
  }

  async login(correo: string, contrasena: string) {
    const usuario = await this.validateUser(correo, contrasena);

    const permisosUsuario = this.getPermisosUsuario(usuario);

    // Payload JWT simplificado (sin permisos)
    const payload = {
      sub: usuario.id_usuario_pk,
      correo: usuario.correo_usuario,
      rol: usuario.rol?.nombre_rol,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET,
    });

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('✅ Token generado correctamente para:', correo);
    }

    // Permisos detallados devueltos en la respuesta (pero no dentro del JWT)
    const permisosConEstado =
      usuario.permisos
        ?.filter((p: any) => p.activo)
        .map((p: any) => ({
          permiso: `${p.module.nombre}:${p.accion}`,
          activo: p.activo,
        })) || [];

    return {
      access_token: token,
      usuario: {
        id: usuario.id_usuario_pk,
        correo: usuario.correo_usuario,
        nombre: usuario.nombre_usuario,
        apellido: usuario.apellido_usuario,
        rol: usuario.rol?.nombre_rol,
        permisos:
          permisosConEstado.length > 0
            ? permisosConEstado
            : permisosUsuario.map((p) => ({ permiso: p, activo: true })),
      },
    };
  }
}
