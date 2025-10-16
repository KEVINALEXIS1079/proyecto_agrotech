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
    @InjectRepository(Permiso) private readonly permisoRepo: Repository<Permiso>,
    @InjectRepository(PermisoModule) private readonly permisoModuleRepo: Repository<PermisoModule>,
    @InjectRepository(Rol) private readonly rolRepo: Repository<Rol>,
    @InjectRepository(Usuario) private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // =========================
  // CRUD catálogo de permisos
  // =========================
  async create(createDto: CreatePermisoDto) {
    const moduleEntity = await this.permisoModuleRepo.findOne({
      where: { id_permiso_module_pk: createDto.moduleId },
    });
    if (!moduleEntity) throw new NotFoundException('Módulo no encontrado');

    const permisoExistente = await this.permisoRepo.findOne({
      where: { accion: createDto.accion, module: { id_permiso_module_pk: createDto.moduleId } },
    });
    if (permisoExistente) throw new BadRequestException('El permiso ya existe para este módulo');

    const permisoCompleto = `${moduleEntity.nombre}:${createDto.accion}`;
    const permiso = this.permisoRepo.create({
      accion: createDto.accion,
      modulo: moduleEntity.nombre,
      permisoCompleto,
      module: moduleEntity,
      activo: createDto.activo ?? true,
    });
    const saved = await this.permisoRepo.save(permiso);

    return {
      message: 'Permiso creado exitosamente',
      permiso: {
        id: saved.id_permiso_pk,
        accion: saved.accion,
        modulo: saved.modulo,
        permisoCompleto: saved.permisoCompleto,
        activo: saved.activo,
        moduleId: moduleEntity.id_permiso_module_pk,
      },
    };
  }

  async findAll(moduleId?: number) {
    const where: any = {};
    if (moduleId) where.module = { id_permiso_module_pk: moduleId };

    const permisos = await this.permisoRepo.find({
      where,
      relations: ['module'],
      order: { modulo: 'ASC', accion: 'ASC' },
    });

    return {
      total: permisos.length,
      permisos: permisos.map(p => ({
        id: p.id_permiso_pk,
        accion: p.accion,
        modulo: p.modulo,
        permisoCompleto: p.permisoCompleto,
        activo: p.activo,
        module: { id: p.module.id_permiso_module_pk, nombre: p.module.nombre },
      })),
    };
  }

  async findOne(id: number) {
    const p = await this.permisoRepo.findOne({ where: { id_permiso_pk: id }, relations: ['module'] });
    if (!p) throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    return {
      id: p.id_permiso_pk,
      accion: p.accion,
      modulo: p.modulo,
      permisoCompleto: p.permisoCompleto,
      activo: p.activo,
      module: { id: p.module.id_permiso_module_pk, nombre: p.module.nombre },
    };
  }

  async update(id: number, updateDto: UpdatePermisoDto) {
    const permiso = await this.permisoRepo.findOne({ where: { id_permiso_pk: id }, relations: ['module'] });
    if (!permiso) throw new NotFoundException(`Permiso con ID ${id} no encontrado`);

    if (updateDto.moduleId) {
      const moduleEntity = await this.permisoModuleRepo.findOne({
        where: { id_permiso_module_pk: updateDto.moduleId },
      });
      if (!moduleEntity) throw new NotFoundException('Módulo no encontrado');
      permiso.module = moduleEntity;
      permiso.modulo = moduleEntity.nombre;
    }

    if (updateDto.accion !== undefined) permiso.accion = updateDto.accion;
    if (updateDto.activo !== undefined) permiso.activo = updateDto.activo;

    permiso.permisoCompleto = `${permiso.modulo}:${permiso.accion}`;
    const saved = await this.permisoRepo.save(permiso);

    return {
      message: 'Permiso actualizado exitosamente',
      permiso: {
        id: saved.id_permiso_pk,
        accion: saved.accion,
        modulo: saved.modulo,
        permisoCompleto: saved.permisoCompleto,
        activo: saved.activo,
        moduleId: saved.module.id_permiso_module_pk,
      },
    };
  }

  /**
   * Activa/Desactiva el permiso en el CATÁLOGO (global).
   * Para asignación por usuario/rol usar los toggles de relación.
   */
  async toggle(toggleDto: TogglePermisoDto) {
    const permiso = await this.permisoRepo.findOne({ where: { id_permiso_pk: toggleDto.permisoId } });
    if (!permiso) throw new NotFoundException(`Permiso con ID ${toggleDto.permisoId} no encontrado`);

    const user = await this.usuarioRepo.findOne({ where: { id_usuario_pk: toggleDto.userId } });
    if (!user) throw new NotFoundException(`Usuario con ID ${toggleDto.userId} no encontrado`);

    permiso.activo = toggleDto.activo;
    const saved = await this.permisoRepo.save(permiso);

    return {
      message: `Permiso ${toggleDto.activo ? 'activado' : 'desactivado'} exitosamente`,
      permiso: {
        id: saved.id_permiso_pk,
        accion: saved.accion,
        modulo: saved.modulo,
        permisoCompleto: saved.permisoCompleto,
        activo: saved.activo,
      },
    };
  }

  async remove(id: number) {
    const permiso = await this.permisoRepo.findOne({
      where: { id_permiso_pk: id },
      relations: ['roles', 'usuarios'],
    });
    if (!permiso) throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    if (permiso.roles?.length) throw new BadRequestException('No se puede eliminar: asignado a roles');
    if (permiso.usuarios?.length) throw new BadRequestException('No se puede eliminar: asignado a usuarios');

    await this.permisoRepo.remove(permiso);
    return { message: 'Permiso eliminado exitosamente', id };
  }

  // =========================
  // Asignaciones en bloque
  // =========================
  async assignPermisosToRole(dto: AssignPermisosDto) {
    if (!dto.roleId) throw new BadRequestException('Se requiere roleId');
    const role = await this.rolRepo.findOne({ where: { id_rol_pk: dto.roleId }, relations: ['permisos'] });
    if (!role) throw new NotFoundException(`Rol con ID ${dto.roleId} no encontrado`);

    const permisos = await this.permisoRepo.find({ where: { id_permiso_pk: In(dto.permisoIds) } });
    if (permisos.length !== dto.permisoIds.length) {
      const encontrados = permisos.map(p => p.id_permiso_pk);
      const faltantes = dto.permisoIds.filter(id => !encontrados.includes(id));
      throw new BadRequestException(`Permisos no encontrados: ${faltantes.join(', ')}`);
    }

    role.permisos = permisos;
    const saved = await this.rolRepo.save(role);

    return {
      message: 'Permisos asignados al rol exitosamente',
      rol: {
        id: saved.id_rol_pk,
        nombre: saved.nombre_rol,
        permisos: saved.permisos.map(p => ({ id: p.id_permiso_pk, permiso: p.permisoCompleto, activo: p.activo })),
      },
    };
  }

  async assignPermisosToUser(dto: AssignPermisosDto) {
    if (!dto.userId) throw new BadRequestException('Se requiere userId');
    const user = await this.usuarioRepo.findOne({
      where: { id_usuario_pk: dto.userId },
      relations: ['permisos', 'rol', 'rol.permisos'],
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${dto.userId} no encontrado`);

    const solicitados = await this.permisoRepo.find({ where: { id_permiso_pk: In(dto.permisoIds) } });
    if (solicitados.length !== dto.permisoIds.length) {
      const encontrados = solicitados.map(p => p.id_permiso_pk);
      const faltantes = dto.permisoIds.filter(id => !encontrados.includes(id));
      throw new BadRequestException(`Permisos no encontrados: ${faltantes.join(', ')}`);
    }

    const nuevos = solicitados.filter(np => !(user.permisos ?? []).some(p => p.id_permiso_pk === np.id_permiso_pk));
    if (!nuevos.length) throw new BadRequestException('El usuario ya tiene todos los permisos solicitados');

    user.permisos = [...(user.permisos ?? []), ...nuevos];
    const saved = await this.usuarioRepo.save(user);

    return {
      message: 'Permisos asignados al usuario exitosamente (sin eliminar existentes)',
      usuario: {
        id: saved.id_usuario_pk,
        nombre: saved.nombre_usuario,
        correo: saved.correo_usuario,
        permisos: saved.permisos.map(p => ({ id: p.id_permiso_pk, permiso: p.permisoCompleto, activo: p.activo })),
      },
    };
  }

  // =========================
  // Listados para el FRONT
  // =========================

  /** Vista simple: efectivos (rol ± directos) */
  async getPermisosByUsuario(userId: number) {
    const user = await this.usuarioRepo.findOne({
      where: { id_usuario_pk: userId },
      relations: ['permisos', 'rol', 'rol.permisos'],
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);

    const directos = user.permisos ?? [];
    const deRol = user.rol?.permisos ?? [];
    const todos = [...directos, ...deRol];

    const unicos = todos.filter((perm, i, arr) => i === arr.findIndex(p => p.id_permiso_pk === perm.id_permiso_pk));

    return {
      usuario: {
        id: user.id_usuario_pk,
        nombre: user.nombre_usuario,
        correo: user.correo_usuario,
        rol: user.rol ? user.rol.nombre_rol : null,
      },
      permisos: unicos.map(p => ({
        id: p.id_permiso_pk,
        permiso: p.permisoCompleto,
        activo: p.activo,
        origen: directos.some(dp => dp.id_permiso_pk === p.id_permiso_pk) ? 'usuario' : 'rol',
      })),
    };
  }

  /** Checklist: catálogo completo con selected + fuente para usuario */
  async getPermisosForUserSelection(userId: number, moduleId?: number) {
    const user = await this.usuarioRepo.findOne({
      where: { id_usuario_pk: userId },
      relations: ['rol', 'rol.permisos', 'permisos'],
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);

    const where: any = {};
    if (moduleId) where.module = { id_permiso_module_pk: moduleId };

    const catalogo = await this.permisoRepo.find({
      where,
      relations: ['module'],
      order: { modulo: 'ASC', accion: 'ASC' },
    });

    const setUser = new Set((user.permisos ?? []).map(p => p.id_permiso_pk));
    const setRol = new Set((user.rol?.permisos ?? []).map(p => p.id_permiso_pk));

    const permisos = catalogo.map(p => {
      const selected = setUser.has(p.id_permiso_pk) || setRol.has(p.id_permiso_pk);
      const fuente = setUser.has(p.id_permiso_pk) ? 'usuario' : setRol.has(p.id_permiso_pk) ? 'rol' : null;
      return {
        id: p.id_permiso_pk,
        accion: p.accion,
        modulo: p.modulo,
        permisoCompleto: p.permisoCompleto,
        selected,
        fuente,
        module: { id: p.module.id_permiso_module_pk, nombre: p.module.nombre },
      };
    });

    return {
      usuario: { id: user.id_usuario_pk, nombre: user.nombre_usuario, correo: user.correo_usuario, rol: user.rol?.nombre_rol ?? null },
      total: permisos.length,
      permisos,
    };
  }

  /** Checklist: catálogo completo con selected para rol */
  async getPermisosForRoleSelection(roleId: number, moduleId?: number) {
    const rol = await this.rolRepo.findOne({ where: { id_rol_pk: roleId }, relations: ['permisos'] });
    if (!rol) throw new NotFoundException(`Rol con ID ${roleId} no encontrado`);

    const where: any = {};
    if (moduleId) where.module = { id_permiso_module_pk: moduleId };

    const catalogo = await this.permisoRepo.find({
      where,
      relations: ['module'],
      order: { modulo: 'ASC', accion: 'ASC' },
    });

    const setRol = new Set((rol.permisos ?? []).map(p => p.id_permiso_pk));

    const permisos = catalogo.map(p => ({
      id: p.id_permiso_pk,
      accion: p.accion,
      modulo: p.modulo,
      permisoCompleto: p.permisoCompleto,
      selected: setRol.has(p.id_permiso_pk),
      module: { id: p.module.id_permiso_module_pk, nombre: p.module.nombre },
    }));

    return { rol: { id: rol.id_rol_pk, nombre: rol.nombre_rol }, total: permisos.length, permisos };
  }

  // =========================
  // Toggles de RELACIÓN
  // =========================
  async togglePermisoOnUser(userId: number, permisoId: number, enable: boolean) {
    const user = await this.usuarioRepo.findOne({
      where: { id_usuario_pk: userId },
      relations: ['permisos', 'rol', 'rol.permisos'],
    });
    if (!user) throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);

    const permiso = await this.permisoRepo.findOne({ where: { id_permiso_pk: permisoId } });
    if (!permiso) throw new NotFoundException(`Permiso con ID ${permisoId} no encontrado`);

    const tieneDirecto = (user.permisos ?? []).some(p => p.id_permiso_pk === permisoId);
    const vienePorRol = (user.rol?.permisos ?? []).some(p => p.id_permiso_pk === permisoId);

    if (enable) {
      if (!tieneDirecto) {
        user.permisos = [...(user.permisos ?? []), permiso];
        await this.usuarioRepo.save(user);
      }
    } else {
      if (tieneDirecto) {
        user.permisos = user.permisos.filter(p => p.id_permiso_pk !== permisoId);
        await this.usuarioRepo.save(user);
      }
    }

    return { userId, permisoId, enabled: enable, fuente: enable ? 'usuario' : (vienePorRol ? 'rol' : null) };
  }

  async togglePermisoOnRole(roleId: number, permisoId: number, enable: boolean) {
    const rol = await this.rolRepo.findOne({ where: { id_rol_pk: roleId }, relations: ['permisos'] });
    if (!rol) throw new NotFoundException(`Rol con ID ${roleId} no encontrado`);

    const permiso = await this.permisoRepo.findOne({ where: { id_permiso_pk: permisoId } });
    if (!permiso) throw new NotFoundException(`Permiso con ID ${permisoId} no encontrado`);

    const tiene = (rol.permisos ?? []).some(p => p.id_permiso_pk === permisoId);

    if (enable) {
      if (!tiene) {
        rol.permisos = [...(rol.permisos ?? []), permiso];
        await this.rolRepo.save(rol);
      }
    } else {
      if (tiene) {
        rol.permisos = rol.permisos.filter(p => p.id_permiso_pk !== permisoId);
        await this.rolRepo.save(rol);
      }
    }

    return { roleId, permisoId, enabled: enable };
  }
}
