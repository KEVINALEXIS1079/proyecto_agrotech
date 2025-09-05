import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Rol } from '../roles/entities/rol.entity';
import { CorreoService } from 'src/common/middleware/correo/correo.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    private readonly correoService: CorreoService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<string> {
    const rol = await this.rolRepository.findOneBy({ id_rol_pk: dto.id_rol_fk });
    if (!rol) throw new NotFoundException('El rol especificado no existe');

    const existeCorreo = await this.usuarioRepository.findOne({
      where: { correo_usuario: dto.correo_usuario },
    });
    if (existeCorreo) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const existeCedula = await this.usuarioRepository.findOne({
      where: { cedula_usuario: dto.cedula_usuario },
    });
    if (existeCedula) {
      throw new BadRequestException('La cédula ya está registrada');
    }

    const hashedPassword = await bcrypt.hash(dto.contrasena_usuario, 10);
    const nuevoUsuario = this.usuarioRepository.create({
      ...dto,
      contrasena_usuario: hashedPassword,
      rol,
    });

    await this.usuarioRepository.save(nuevoUsuario);
    return `Usuario creado correctamente con rol: ${rol.nombre_rol}`;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario_pk: id },
      relations: ['rol'],
      withDeleted: true,
    });

    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { correo_usuario: email },
      relations: ['rol'],
    });

    if (!usuario) throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<string> {
    const usuario = await this.findOne(id);

    if (dto.id_rol_fk && dto.id_rol_fk !== usuario.rol?.id_rol_pk) {
      const nuevoRol = await this.rolRepository.findOneBy({ id_rol_pk: dto.id_rol_fk });
      if (!nuevoRol) throw new NotFoundException('El rol especificado no existe');
      usuario.rol = nuevoRol;
    }

    Object.assign(usuario, dto);
    await this.usuarioRepository.save(usuario);
    return 'Usuario actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.usuarioRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return `Usuario con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.usuarioRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return `Usuario con ID ${id} restaurado correctamente`;
  }

  // Solicitar recuperación
  async solicitarRecuperacion(correo_usuario: string): Promise<string> {
    const email = correo_usuario.trim().toLowerCase();

    const usuario = await this.usuarioRepository.findOne({
      where: { correo_usuario: email },
    });

    if (!usuario) return 'Si el correo existe, recibirás un código de recuperación.';

    const codigoExistente = await this.redisClient.get(`recuperacion:${email}`);
    if (codigoExistente) {
      throw new BadRequestException('Ya hay un código activo. Revisa tu correo o espera 10 minutos.');
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisClient.set(`recuperacion:${email}`, codigo, 'EX', 600); // 10 minutos

    const nombreCompleto = `${usuario.nombre_usuario} ${usuario.apellido_usuario}`;
    await this.correoService.enviarCodigoRecuperacion(email, codigo, nombreCompleto);

    return 'Si el correo existe, recibirás un código de recuperación.';
  }

  // Verificar código
  async verificarCodigo(email: string, codigo: string): Promise<string> {
    const codigoGuardado = await this.redisClient.get(`recuperacion:${email}`);
    if (!codigoGuardado) throw new ForbiddenException('Código no solicitado o expirado');
    if (codigoGuardado !== codigo) throw new ForbiddenException('Código incorrecto');
    return 'Código verificado correctamente';
  }

  // Cambiar contraseña
  async cambiarContrasena(email: string, codigo: string, nuevaContrasena: string): Promise<string> {
    const codigoGuardado = await this.redisClient.get(`recuperacion:${email}`);
    if (!codigoGuardado || codigoGuardado !== codigo) {
      throw new ForbiddenException('Código incorrecto o expirado');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { correo_usuario: email },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (nuevaContrasena.length < 8) {
      throw new BadRequestException('La contraseña debe tener al menos 8 caracteres');
    }

    usuario.contrasena_usuario = await bcrypt.hash(nuevaContrasena, 10);
    await this.usuarioRepository.save(usuario);
    await this.redisClient.del(`recuperacion:${email}`);

    return 'Contraseña actualizada correctamente';
  }
}
