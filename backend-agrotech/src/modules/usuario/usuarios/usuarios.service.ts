import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RegistrarUsuarioPublicDTO } from './dto/crear-usuario-public.dto';
import { Rol } from '../roles/entities/rol.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(dto: CreateUsuarioDto, imgPath?: string): Promise<string> {
    const rol = await this.rolRepository.findOneBy({ id_rol_pk: dto.id_rol_fk });
    if (!rol) throw new NotFoundException('El rol especificado no existe');

    const existeCorreo = await this.usuarioRepository.findOne({
      where: { correo_usuario: dto.correo_usuario },
    });
    if (existeCorreo) throw new BadRequestException('El correo electrónico ya está registrado');

    const existeCedula = await this.usuarioRepository.findOne({
      where: { cedula_usuario: dto.cedula_usuario },
    });
    if (existeCedula) throw new BadRequestException('La cédula ya está registrada');

    const hashedPassword = await bcrypt.hash(dto.contrasena_usuario, 10);

    let finalPath = imgPath;
    if (imgPath && dto.correo_usuario) {
      finalPath = await this.moveImageToUserFolder(imgPath, dto.correo_usuario);
    }

    const nuevoUsuario = this.usuarioRepository.create({
      ...dto,
      contrasena_usuario: hashedPassword,
      rol,
      img_usuario: finalPath ?? null,
    });

    await this.usuarioRepository.save(nuevoUsuario);
    return `Usuario creado correctamente con rol: ${rol.nombre_rol}`;
  }

  async createPublic(dto: RegistrarUsuarioPublicDTO, imgPath?: string): Promise<string> {
    const rolUsuario = await this.rolRepository.findOne({
      where: { nombre_rol: 'Invitado' },
    });
    if (!rolUsuario) throw new NotFoundException('El rol "Invitado" no existe');

    const existeCorreo = await this.usuarioRepository.findOne({
      where: { correo_usuario: dto.correo_usuario },
    });
    if (existeCorreo) throw new BadRequestException('El correo electrónico ya está registrado');

    const existeCedula = await this.usuarioRepository.findOne({
      where: { cedula_usuario: dto.cedula_usuario },
    });
    if (existeCedula) throw new BadRequestException('La cédula ya está registrada');

    const hashedPassword = await bcrypt.hash(dto.contrasena_usuario, 10);

    let finalPath = imgPath;
    if (imgPath && dto.correo_usuario) {
      finalPath = await this.moveImageToUserFolder(imgPath, dto.correo_usuario);
    }

    const nuevoUsuario = this.usuarioRepository.create({
      ...dto,
      contrasena_usuario: hashedPassword,
      rol: rolUsuario,
      img_usuario: finalPath ?? null,
    });

    await this.usuarioRepository.save(nuevoUsuario);
    return `Usuario creado correctamente con rol: ${rolUsuario.nombre_rol}`;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      relations: ['rol'],
      withDeleted: true,
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario_pk: id },
      relations: ['rol'],
      withDeleted: true,
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto, imgPath?: string): Promise<string> {
    const usuario = await this.findOne(id);

    if (dto.id_rol_fk && dto.id_rol_fk !== usuario.rol?.id_rol_pk) {
      const nuevoRol = await this.rolRepository.findOneBy({ id_rol_pk: dto.id_rol_fk });
      if (!nuevoRol) throw new NotFoundException('El rol especificado no existe');
      usuario.rol = nuevoRol;
    }

    if (imgPath) {
      if (usuario.img_usuario && fs.existsSync(usuario.img_usuario)) {
        fs.unlinkSync(usuario.img_usuario);
      }
      usuario.img_usuario = await this.moveImageToUserFolder(
        imgPath,
        dto.correo_usuario ?? usuario.correo_usuario,
      );
    }

    Object.assign(usuario, dto);
    await this.usuarioRepository.save(usuario);
    return 'Usuario actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const usuario = await this.findOne(id);

    if (usuario.img_usuario && fs.existsSync(usuario.img_usuario)) {
      fs.unlinkSync(usuario.img_usuario);
    }

    const result = await this.usuarioRepository.softDelete({ id_usuario_pk: id });
    if (result.affected === 0) throw new NotFoundException('Usuario no encontrado');

    return `Usuario con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.usuarioRepository.restore({ id_usuario_pk: id });
    if (result.affected === 0) throw new NotFoundException('Usuario no encontrado');

    return `Usuario con ID ${id} restaurado correctamente`;
  }

  // Helpers
  private async moveImageToUserFolder(originalPath: string, correo: string): Promise<string> {
    const userFolder = path.join('./uploads/usuarios', correo);
    const fileName = path.basename(originalPath);
    const newPath = path.join(userFolder, fileName);

    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    if (fs.existsSync(originalPath)) {
      fs.renameSync(originalPath, newPath);
      return newPath;
    }

    return originalPath;
  }
}
