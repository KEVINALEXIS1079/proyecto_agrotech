import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Not } from 'typeorm';
import { Rol } from '../entities/rol.entity';
import { CreateRolDto } from '../dto/create-rol.dto';
import { UpdateRolDto } from '../dto/update-role.dto';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';

type CountRow = { id: string; nombre: string; usuarios: string };

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  /* =======================
   * CRUD
   * ======================= */

  async create(dto: CreateRolDto): Promise<string> {
    const existerol = await this.rolRepository.findOne({ where: { nombre_rol: dto.nombre_rol } });
    if (existerol) throw new BadRequestException('El rol ya está registrado');

    const rol = this.rolRepository.create(dto);
    await this.rolRepository.save(rol);
    return 'Rol creado correctamente';
  }

  /** Activos (no eliminados) */
  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find({ where: { delete_at: IsNull() }, order: { nombre_rol: 'ASC' } });
  }

  /** Solo eliminados */
  async findDeleted(): Promise<Rol[]> {
    return this.rolRepository.find({
      withDeleted: true,
      where: { delete_at: Not(IsNull()) },
      order: { nombre_rol: 'ASC' },
    });
  }

  /** Todos (activos + eliminados) */
  async findAllIncludingDeleted(): Promise<Rol[]> {
    return this.rolRepository.find({ withDeleted: true, order: { nombre_rol: 'ASC' } });
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOne({ where: { id_rol_pk: id }, withDeleted: true });
    if (!rol) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return rol;
  }

  async update(id: number, dto: UpdateRolDto): Promise<string> {
    const rol = await this.findOne(id);
    if (dto.nombre_rol && dto.nombre_rol !== rol.nombre_rol) {
      const existe = await this.rolRepository.findOne({ where: { nombre_rol: dto.nombre_rol } });
      if (existe) throw new BadRequestException(`El rol "${dto.nombre_rol}" ya está registrado`);
    }
    Object.assign(rol, dto);
    await this.rolRepository.save(rol);
    return 'Rol actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.rolRepository.softDelete(id); // id == PK => id_rol_pk
    if (result.affected === 0) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return `Rol con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.rolRepository.restore(id);
    if (result.affected === 0) throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    return `Rol con ID ${id} restaurado correctamente`;
  }

  /* =======================
   * Conteos (tal cual los tenías)
   * ======================= */
  // ... (deja tus count methods como están)
}
