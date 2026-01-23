import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from 'src/modules/usuario/usuarios/services/usuarios.service';
import { TokenRedisService } from './token-redis.service'; // 🔹 Redis Token Manager

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly tokenRedisService: TokenRedisService, // 🔹 Redis integrado
  ) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está configurado en las variables de entorno.');
    }

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('AuthService - JWT Secret configurado:', secret);
    }
  }

  /**
   * Valida las credenciales del usuario contra la base de datos.
   */
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

  /**
   * Extrae los permisos combinados del rol y permisos directos del usuario.
   */
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

  /**
   * Inicia sesión, genera token JWT y lo almacena temporalmente en Redis.
   */
  async login(correo: string, contrasena: string) {
    const usuario = await this.validateUser(correo, contrasena);
    const permisosUsuario = this.getPermisosUsuario(usuario);

    // 🔹 Payload básico del token
    const payload = {
      sub: usuario.id_usuario_pk,
      correo: usuario.correo_usuario,
      rol: usuario.rol?.nombre_rol,
    };

    const expiresIn = 60 * 60 * 24; // 1 día en segundos

    const token = this.jwtService.sign(payload, {
      expiresIn: `${expiresIn}s`,
      secret: process.env.JWT_SECRET,
    });

    // 🔹 Guardar token activo en Redis (TTL igual al tiempo de expiración)
    await this.tokenRedisService.storeToken(token, expiresIn);

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('Token generado y almacenado en Redis para:', correo);
    }

    // 🔹 Permisos con estado para respuesta
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

  /**
   * Cierra sesión del usuario moviendo el token a blacklist en Redis.
   */
  async logout(token: string): Promise<{ message: string }> {
    const expiresIn = 60 * 60 * 24; // igual al TTL del token

    // 🔹 Mover token a blacklist y eliminarlo de tokens activos
    await this.tokenRedisService.addToBlacklist(token, expiresIn);
    await this.tokenRedisService.deleteToken(token);

    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.log('Token movido a blacklist en Redis.');
    }

    return { message: 'Sesión cerrada correctamente.' };
  }
}
