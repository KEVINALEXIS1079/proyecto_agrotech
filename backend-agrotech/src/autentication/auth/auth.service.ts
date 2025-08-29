import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; //  IMPORTANTE
import { Usuario } from 'src/usuario/usuarios/entities/usuario.entity';

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

    // Usar bcrypt para comparar
    if (!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena_usuario))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    const payload = {
      sub: usuario.id_usuario_pk,
      correo_usuario: usuario.correo_usuario,
      rol: usuario.rol.nombre_rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
