import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

import { Usuario } from '../entities/usuario.entity';
import { Permiso } from 'src/modules/permisos/entities/permiso.entity';
import { Rol } from '../../roles/entities/rol.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { RegistrarUsuarioPublicDTO } from '../dto/crear-usuario-public.dto';
import { RecuperarContrasenaDto } from '../dto/recuperar-contrasena.dto';
import { VerificarCodigoDto } from '../dto/verificar-codigo.dto';
import { CambiarContrasenaDto } from '../dto/cambiar-contrasena.dto';
import { CorreoService } from 'src/common/services/correo/correo.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,

    private readonly correoService: CorreoService,
  ) {}

  async create(dto: CreateUsuarioDto, imgPath?: string): Promise<string> {
    const rol = await this.rolRepository.findOneBy({ id_rol_pk: dto.id_rol_fk });
    if (!rol) throw new NotFoundException('El rol especificado no existe');

    const existeCorreo = await this.usuarioRepository.findOne({
      where: { correo_usuario: dto.correo_usuario },
    });
    if (existeCorreo) throw new BadRequestException('El correo ya existe');

    const existeCedula = await this.usuarioRepository.findOne({
      where: { cedula_usuario: dto.cedula_usuario },
    });
    if (existeCedula) throw new BadRequestException('La cédula ya existe');

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
    if (existeCorreo) throw new BadRequestException('El correo ya existe');

    const existeCedula = await this.usuarioRepository.findOne({
      where: { cedula_usuario: dto.cedula_usuario },
    });
    if (existeCedula) throw new BadRequestException('La cédula ya existe');

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
      relations: [
        'rol',
        'rol.permisos',
        'rol.permisos.module',
        'permisos',
        'permisos.module',
      ],
      withDeleted: true,
    });
  }

  async findOne(id: number, relations: string[] = []): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario_pk: id },
      relations: [
        ...relations,
        'rol',
        'rol.permisos',
        'rol.permisos.module',
        'permisos',
        'permisos.module',
      ],
      withDeleted: true,
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  async findByCorreoConPermisos(correo: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({
      where: { correo_usuario: correo },
      relations: [
        'rol',
        'rol.permisos',
        'rol.permisos.module',
        'permisos',
        'permisos.module',
      ],
    });
  }

  async update(id: number, dto: UpdateUsuarioDto, imgPath?: string): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (dto.id_rol_fk && dto.id_rol_fk !== usuario.rol?.id_rol_pk) {
      const nuevoRol = await this.rolRepository.findOne({
        where: { id_rol_pk: dto.id_rol_fk },
        relations: ['permisos', 'permisos.module'],
      });
      if (!nuevoRol) throw new NotFoundException('Rol no encontrado');
      usuario.rol = nuevoRol;
    }

    if (dto.contrasena_usuario) {
      usuario.contrasena_usuario = await bcrypt.hash(dto.contrasena_usuario, 10);
    }

    if (imgPath) {
      if (usuario.img_usuario && fs.existsSync(usuario.img_usuario)) {
        fs.unlinkSync(usuario.img_usuario);
      }
      usuario.img_usuario = await this.moveImageToUserFolder(imgPath, usuario.correo_usuario);
    }

    Object.assign(usuario, dto);
    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<string> {
    const usuario = await this.findOne(id);

    if (usuario.img_usuario && fs.existsSync(usuario.img_usuario)) {
      fs.unlinkSync(usuario.img_usuario);
    }

    await this.usuarioRepository.softDelete({ id_usuario_pk: id });
    return `Usuario con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.usuarioRepository.restore({ id_usuario_pk: id });
    if (result.affected === 0) throw new NotFoundException('Usuario no encontrado');
    return `Usuario con ID ${id} restaurado correctamente`;
  }

  async asignarPermisos(usuarioId: number, permisosIds: number[]): Promise<Usuario> {
    const usuario = await this.findOne(usuarioId, ['permisos']);
    
    const permisosExistentes = await this.permisoRepository.find({
      where: { id_permiso_pk: In(permisosIds) },
    });

    if (permisosExistentes.length !== permisosIds.length) {
      const idsEncontrados = permisosExistentes.map(p => p.id_permiso_pk);
      const idsNoEncontrados = permisosIds.filter(id => !idsEncontrados.includes(id));
      throw new NotFoundException(`Permisos no encontrados: ${idsNoEncontrados.join(', ')}`);
    }

    const permisosNuevos = permisosExistentes.filter(
      permiso => !usuario.permisos.some(p => p.id_permiso_pk === permiso.id_permiso_pk),
    );

    if (permisosNuevos.length === 0) {
      throw new BadRequestException('El usuario ya tiene todos los permisos solicitados');
    }

    usuario.permisos.push(...permisosNuevos);
    return await this.usuarioRepository.save(usuario);
  }

  async quitarPermisos(usuarioId: number, permisosIds: number[]): Promise<Usuario> {
    const usuario = await this.findOne(usuarioId, ['permisos']);
    const permisosActuales = usuario.permisos.length;
    usuario.permisos = usuario.permisos.map(permiso => {
      if (permisosIds.includes(permiso.id_permiso_pk)) {
        return { ...permiso, activo: false }; // Desactiva el permiso
      }
      return permiso;
    });
    if (usuario.permisos.every(p => !permisosIds.includes(p.id_permiso_pk))) {
      throw new BadRequestException('El usuario no tiene los permisos especificados');
    }
    return await this.usuarioRepository.save(usuario);
  }

  async asignarRol(usuarioId: number, rolId: number): Promise<Usuario> {
    const usuario = await this.findOne(usuarioId, ['permisos']);
    const nuevoRol = await this.rolRepository.findOne({
      where: { id_rol_pk: rolId },
      relations: ['permisos', 'permisos.module'],
    });

    if (!nuevoRol) throw new NotFoundException('Rol no encontrado');

    const permisosDelRol = nuevoRol.permisos.filter(
      permisoRol => !usuario.permisos.some(p => p.id_permiso_pk === permisoRol.id_permiso_pk),
    );

    usuario.permisos.push(...permisosDelRol);
    usuario.rol = nuevoRol;

    return await this.usuarioRepository.save(usuario);
  }

  async obtenerPermisosUsuario(usuarioId: number): Promise<{ permisos: Permiso[] }> {
    const usuario = await this.findOne(usuarioId, ['permisos', 'rol', 'rol.permisos']);
    
    const permisosRol = usuario.rol?.permisos || [];
    const permisosDirectos = usuario.permisos || [];
    
    const todosPermisos = [...permisosRol, ...permisosDirectos];
    const permisosUnicos = todosPermisos.filter((permiso, index, self) =>
      index === self.findIndex(p => p.id_permiso_pk === permiso.id_permiso_pk),
    );

    return { permisos: permisosUnicos };
  }

  async recuperarContrasena(dto: RecuperarContrasenaDto): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { correo_usuario: dto.email } });
    if (!usuario) throw new BadRequestException('Correo no encontrado');

    const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
    usuario.codigo_recuperacion = codigo;
    usuario.codigo_expiracion = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos
    await this.usuarioRepository.save(usuario);

    try {
      await this.correoService.enviarCodigoRecuperacion(dto.email, codigo, usuario.nombre_usuario || 'Usuario');
      return { message: `Código de verificación enviado a ${dto.email}` };
    } catch (error) {
      throw new BadRequestException(`Error al enviar el código: ${error.message}`);
    }
  }

  async verificarCodigo(dto: VerificarCodigoDto): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { correo_usuario: dto.email } });
    if (!usuario || !usuario.codigo_recuperacion || !usuario.codigo_expiracion) {
      throw new BadRequestException('Correo o código no válido');
    }

    if (usuario.codigo_recuperacion !== dto.codigo) {
      throw new BadRequestException('Código de verificación incorrecto');
    }

    if (new Date() > usuario.codigo_expiracion) {
      throw new BadRequestException('Código de verificación expirado');
    }

    usuario.codigo_recuperacion = null;
    usuario.codigo_expiracion = null;
    await this.usuarioRepository.save(usuario);

    return { message: 'Código verificado correctamente' };
  }

  async cambiarContrasena(dto: CambiarContrasenaDto): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOne({ where: { correo_usuario: dto.email } });
    if (!usuario) throw new BadRequestException('Correo no encontrado');

    if (!usuario.codigo_recuperacion || !usuario.codigo_expiracion) {
      throw new BadRequestException('Código de verificación no válido o no verificado');
    }

    if (usuario.codigo_recuperacion !== dto.codigo) {
      throw new BadRequestException('Código de verificación incorrecto');
    }

    if (new Date() > usuario.codigo_expiracion) {
      throw new BadRequestException('Código de verificación expirado');
    }

    const hashedPassword = await bcrypt.hash(dto.nuevaContrasena, 10);
    usuario.contrasena_usuario = hashedPassword;
    usuario.codigo_recuperacion = null;
    usuario.codigo_expiracion = null;
    await this.usuarioRepository.save(usuario);

    return { message: 'Contraseña cambiada correctamente' };
  }

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