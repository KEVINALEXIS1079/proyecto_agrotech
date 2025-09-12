import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async login(correo: string, contrasena: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo_usuario: correo },
      relations: ['rol'],
    });

    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena_usuario))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload = {
      sub: usuario.id_usuario_pk,
      username: usuario.correo_usuario, // ← Agregar esta línea
      correo_usuario: usuario.correo_usuario,
      rol: usuario.rol.nombre_rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario_pk,
        correo: usuario.correo_usuario,
        nombre: usuario.nombre_usuario,
        apellido: usuario.apellido_usuario,
        rol: usuario.rol.nombre_rol
      }
    };
  }
}