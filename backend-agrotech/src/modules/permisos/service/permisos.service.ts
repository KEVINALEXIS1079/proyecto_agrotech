import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permiso } from '../entities/permiso.entity';
import { PermisoModule } from 'src/modules/permiso-module/entities/permiso-module.entity';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';
import { Rol } from 'src/modules/usuario/roles/entities/rol.entity';
import { CreatePermisoDto } from '../dto/create-permiso.dto';
import { UpdatePermisoDto } from '../dto/update-permiso.dto';
import { TogglePermisoDto } from '../dto/toggle-permiso.dto';
import { AssignPermisosDto } from '../dto/assign-permisos.dto';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
    @InjectRepository(PermisoModule)
    private readonly permisoModuleRepo: Repository<PermisoModule>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  /**
   * Crear un nuevo permiso
   */
  async create(createDto: CreatePermisoDto) {
    const moduleEntity = await this.permisoModuleRepo.findOne({
      where: { id_permiso_module_pk: createDto.moduleId },
    });

    if (!moduleEntity) {
      throw new NotFoundException('Módulo no encontrado');
    }

    // Verificar si el permiso ya existe
    const permisoExistente = await this.permisoRepo.findOne({
      where: {
        accion: createDto.accion,
        module: { id_permiso_module_pk: createDto.moduleId },
      },
    });

    if (permisoExistente) {
      throw new BadRequestException('El permiso ya existe para este módulo');
    }

    const permisoCompleto = `${moduleEntity.nombre}:${createDto.accion}`;

    const permiso = this.permisoRepo.create({
      accion: createDto.accion,
      modulo: moduleEntity.nombre,
      permisoCompleto,
      module: moduleEntity,
      activo: createDto.activo !== undefined ? createDto.activo : true,
    });

    const permisoGuardado = await this.permisoRepo.save(permiso);

    return {
      message: 'Permiso creado exitosamente',
      permiso: {
        id: permisoGuardado.id_permiso_pk,
        accion: permisoGuardado.accion,
        modulo: permisoGuardado.modulo,
        permisoCompleto: permisoGuardado.permisoCompleto,
        activo: permisoGuardado.activo,
        moduleId: moduleEntity.id_permiso_module_pk,
      },
    };
  }

  /**
   * Obtener todos los permisos, opcionalmente filtrar por módulo
   */
  async findAll(moduleId?: number) {
    const where: any = {};

    if (moduleId) {
      where.module = { id_permiso_module_pk: moduleId };
    }

    const permisos = await this.permisoRepo.find({
      where,
      relations: ['module'],
      order: { modulo: 'ASC', accion: 'ASC' },
    });

    return {
      total: permisos.length,
      permisos: permisos.map((permiso) => ({
        id: permiso.id_permiso_pk,
        accion: permiso.accion,
        modulo: permiso.modulo,
        permisoCompleto: permiso.permisoCompleto,
        activo: permiso.activo,
        module: {
          id: permiso.module.id_permiso_module_pk,
          nombre: permiso.module.nombre,
        },
      })),
    };
  }

  /**
   * Obtener un permiso por ID
   */
  async findOne(id: number) {
    const permiso = await this.permisoRepo.findOne({
      where: { id_permiso_pk: id },
      relations: ['module'],
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    return {
      id: permiso.id_permiso_pk,
      accion: permiso.accion,
      modulo: permiso.modulo,
      permisoCompleto: permiso.permisoCompleto,
      activo: permiso.activo,
      module: {
        id: permiso.module.id_permiso_module_pk,
        nombre: permiso.module.nombre,
      },
    };
  }

  /**
   * Actualizar un permiso
   */
  async update(id: number, updateDto: UpdatePermisoDto) {
    const permiso = await this.permisoRepo.findOne({
      where: { id_permiso_pk: id },
      relations: ['module'],
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    // Si se actualiza el moduleId, verificar que exista
    if (updateDto.moduleId) {
      const moduleEntity = await this.permisoModuleRepo.findOne({
        where: { id_permiso_module_pk: updateDto.moduleId },
      });

      if (!moduleEntity) {
        throw new NotFoundException('Módulo no encontrado');
      }

      permiso.module = moduleEntity;
      permiso.modulo = moduleEntity.nombre;
    }

    // Actualizar otros campos
    if (updateDto.accion !== undefined) {
      permiso.accion = updateDto.accion;
    }

    if (updateDto.activo !== undefined) {
      permiso.activo = updateDto.activo;
    }

    // Recalcular permisoCompleto si cambió acción o módulo
    permiso.permisoCompleto = `${permiso.modulo}:${permiso.accion}`;

    const permisoActualizado = await this.permisoRepo.save(permiso);

    return {
      message: 'Permiso actualizado exitosamente',
      permiso: {
        id: permisoActualizado.id_permiso_pk,
        accion: permisoActualizado.accion,
        modulo: permisoActualizado.modulo,
        permisoCompleto: permisoActualizado.permisoCompleto,
        activo: permisoActualizado.activo,
        moduleId: permisoActualizado.module.id_permiso_module_pk,
      },
    };
  }

  /**
   * Activar/Desactivar permiso
   */
  async toggle(toggleDto: TogglePermisoDto) {
    const permiso = await this.permisoRepo.findOne({
      where: { id_permiso_pk: toggleDto.permisoId },
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${toggleDto.permisoId} no encontrado`);
    }

    // Verificar si el usuario existe
    const user = await this.usuarioRepo.findOne({
      where: { id_usuario_pk: toggleDto.userId },
    });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${toggleDto.userId} no encontrado`);
    }

    // Cambiar el estado del permiso (o asociarlo/desasociarlo del usuario según necesites)
    permiso.activo = toggleDto.activo;
    const permisoActualizado = await this.permisoRepo.save(permiso);

    return {
      message: `Permiso ${toggleDto.activo ? 'activado' : 'desactivado'} exitosamente`,
      permiso: {
        id: permisoActualizado.id_permiso_pk,
        accion: permisoActualizado.accion,
        modulo: permisoActualizado.modulo,
        permisoCompleto: permisoActualizado.permisoCompleto,
        activo: permisoActualizado.activo,
      },
    };
  }

  /**
   * Eliminar un permiso
   */
  async remove(id: number) {
    const permiso = await this.permisoRepo.findOne({
      where: { id_permiso_pk: id },
      relations: ['roles', 'usuarios'],
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    // Verificar si el permiso está asignado a algún rol o usuario
    if (permiso.roles && permiso.roles.length > 0) {
      throw new BadRequestException('No se puede eliminar el permiso porque está asignado a roles');
    }

    if (permiso.usuarios && permiso.usuarios.length > 0) {
      throw new BadRequestException('No se puede eliminar el permiso porque está asignado a usuarios');
    }

    await this.permisoRepo.remove(permiso);

    return {
      message: 'Permiso eliminado exitosamente',
      id,
    };
  }

  /**
   * Asignar permisos a un rol
   */
  async assignPermisosToRole(assignPermisosDto: AssignPermisosDto) {
    // Verificar si se proporcionó roleId
    if (!assignPermisosDto.roleId) {
      throw new BadRequestException('Se requiere el ID del rol (roleId)');
    }

    const role = await this.rolRepo.findOne({
      where: { id_rol_pk: assignPermisosDto.roleId },
      relations: ['permisos'],
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID ${assignPermisosDto.roleId} no encontrado`);
    }

    // Verificar que todos los permisos existen
    const permisos = await this.permisoRepo.find({
      where: { id_permiso_pk: In(assignPermisosDto.permisoIds) },
    });

    if (permisos.length !== assignPermisosDto.permisoIds.length) {
      const encontrados = permisos.map((p) => p.id_permiso_pk);
      const noEncontrados = assignPermisosDto.permisoIds.filter((id) => !encontrados.includes(id));
      throw new BadRequestException(`Permisos no encontrados: ${noEncontrados.join(', ')}`);
    }

    // Asignar permisos al rol
    role.permisos = permisos;
    const rolActualizado = await this.rolRepo.save(role);

    return {
      message: 'Permisos asignados al rol exitosamente',
      rol: {
        id: rolActualizado.id_rol_pk,
        nombre: rolActualizado.nombre_rol,
        permisos: rolActualizado.permisos.map((p) => ({
          id: p.id_permiso_pk,
          permiso: p.permisoCompleto,
          activo: p.activo,
        })),
      },
    };
  }

  /**
   * Asignar permisos a un usuario (CORREGIDO: añade sin eliminar existentes)
   */
  async assignPermisosToUser(assignPermisosDto: AssignPermisosDto) {
    // Verificar si se proporcionó userId
    if (!assignPermisosDto.userId) {
      throw new BadRequestException('Se requiere el ID del usuario (userId)');
    }

    // Cargar usuario con permisos existentes
    const user = await this.usuarioRepo.findOne({
      where: { id_usuario_pk: assignPermisosDto.userId },
      relations: ['permisos', 'rol', 'rol.permisos'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${assignPermisosDto.userId} no encontrado`);
    }

    // Verificar que todos los permisos solicitados existen
    const permisosSolicitados = await this.permisoRepo.find({
      where: { id_permiso_pk: In(assignPermisosDto.permisoIds) },
    });

    if (permisosSolicitados.length !== assignPermisosDto.permisoIds.length) {
      const encontrados = permisosSolicitados.map((p) => p.id_permiso_pk);
      const noEncontrados = assignPermisosDto.permisoIds.filter((id) => !encontrados.includes(id));
      throw new BadRequestException(`Permisos no encontrados: ${noEncontrados.join(', ')}`);
    }

    // Filtrar solo los permisos nuevos que no estén ya asignados al usuario
    const permisosNuevos = permisosSolicitados.filter(
      (permisoNuevo) =>
        !user.permisos.some((pExistente) => pExistente.id_permiso_pk === permisoNuevo.id_permiso_pk),
    );

    if (permisosNuevos.length === 0) {
      throw new BadRequestException('El usuario ya tiene todos los permisos solicitados');
    }

    // Añadir solo los nuevos al array existente
    user.permisos.push(...permisosNuevos);
    const usuarioActualizado = await this.usuarioRepo.save(user);

    return {
      message: 'Permisos asignados al usuario exitosamente (sin eliminar existentes)',
      usuario: {
        id: usuarioActualizado.id_usuario_pk,
        nombre: usuarioActualizado.nombre_usuario,
        correo: usuarioActualizado.correo_usuario,
        permisos: usuarioActualizado.permisos.map((p) => ({
          id: p.id_permiso_pk,
          permiso: p.permisoCompleto,
          activo: p.activo,
        })),
      },
    };
  }

  /**
   * Obtener permisos de un usuario específico
   */
  async getPermisosByUsuario(userId: number) {
    const user = await this.usuarioRepo.findOne({
      where: { id_usuario_pk: userId },
      relations: ['permisos', 'rol', 'rol.permisos'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Combinar permisos del usuario + permisos del rol
    const permisosUsuario = user.permisos || [];
    const permisosRol = user.rol?.permisos || [];

    const todosPermisos = [...permisosUsuario, ...permisosRol];

    // Eliminar duplicados
    const permisosUnicos = todosPermisos.filter((permiso, index, self) =>
      index === self.findIndex((p) => p.id_permiso_pk === permiso.id_permiso_pk),
    );

    return {
      usuario: {
        id: user.id_usuario_pk,
        nombre: user.nombre_usuario,
        correo: user.correo_usuario,
        rol: user.rol ? user.rol.nombre_rol : null,
      },
      permisos: permisosUnicos.map((p) => ({
        id: p.id_permiso_pk,
        permiso: p.permisoCompleto,
        activo: p.activo,
        origen: permisosUsuario.some((up) => up.id_permiso_pk === p.id_permiso_pk) ? 'usuario' : 'rol',
      })),
    };
  }
}