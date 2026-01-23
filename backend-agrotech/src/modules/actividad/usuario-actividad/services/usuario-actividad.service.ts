import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioActividad } from '../entities/usuario-actividad.entity';
import { CreateUsuarioActividadDto } from '../dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from '../dto/update-usuario-actividad.dto';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';
import { Actividad } from '../../actividades/entities/actividad.entity';

@Injectable()
export class UsuarioActividadService {
  constructor(
    @InjectRepository(UsuarioActividad)
    private readonly usuarioActividadRepository: Repository<UsuarioActividad>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Actividad)
    private readonly actividadesRepository: Repository<Actividad>,
  ) {}

  async create(dto: CreateUsuarioActividadDto): Promise<string> {
    const usuario = await this.usuarioRepository.findOne({
      where: { cedula_usuario: dto.dni_usuario_fk },
    });
    if (!usuario) throw new NotFoundException(`Usuario con cédula ${dto.dni_usuario_fk} no encontrado`);

    const actividad = await this.actividadesRepository.findOne({
      where: { id_actividad_pk: dto.id_actividad_fk },
    });
    if (!actividad) throw new NotFoundException(`Actividad con ID ${dto.id_actividad_fk} no encontrada`);

    const existe = await this.usuarioActividadRepository.findOne({
      where: { usuario: { cedula_usuario: dto.dni_usuario_fk }, actividad: { id_actividad_pk: dto.id_actividad_fk } },
    });
    if (existe) throw new BadRequestException('La actividad ya se asignó a este usuario');

    const nuevaRelacion = this.usuarioActividadRepository.create({ usuario, actividad });
    await this.usuarioActividadRepository.save(nuevaRelacion);
    return `Usuario actividad creada correctamente para el usuario ${usuario.nombre_usuario} en la actividad ${actividad.nombre_actividad}`;
  }

  async findAll(): Promise<UsuarioActividad[]> {
    const relaciones = await this.usuarioActividadRepository.find({
      relations: ['usuario', 'actividad'],
      withDeleted: true,
    });
    if (!relaciones || relaciones.length === 0) throw new NotFoundException('No se encontraron relaciones usuario-actividad');
    return relaciones;
  }

  async findOne(id: number): Promise<UsuarioActividad> {
    const relacion = await this.usuarioActividadRepository.findOne({
      where: { id_usuarios_actividades_pk: id },
      relations: ['usuario', 'actividad'],
      withDeleted: true,
    });
    if (!relacion) throw new NotFoundException(`Usuario actividad con ID ${id} no encontrada`);
    return relacion;
  }

  async update(id: number, dto: UpdateUsuarioActividadDto): Promise<string> {
    const relacion = await this.findOne(id);

    if (dto.dni_usuario_fk) {
      const usuario = await this.usuarioRepository.findOne({
        where: { cedula_usuario: dto.dni_usuario_fk },
      });
      if (!usuario) throw new NotFoundException(`Usuario con cédula ${dto.dni_usuario_fk} no encontrado`);
      relacion.usuario = usuario;
    }

    if (dto.id_actividad_fk) {
      const actividad = await this.actividadesRepository.findOne({
        where: { id_actividad_pk: dto.id_actividad_fk },
      });
      if (!actividad) throw new NotFoundException(`Actividad con ID ${dto.id_actividad_fk} no encontrada`);
      relacion.actividad = actividad;
    }

    // Validar duplicado al actualizar
    const existe = await this.usuarioActividadRepository.findOne({
      where: { usuario: { cedula_usuario: relacion.usuario.cedula_usuario }, actividad: { id_actividad_pk: relacion.actividad.id_actividad_pk } },
    });
    if (existe && existe.id_usuarios_actividades_pk !== id) {
      throw new BadRequestException('La actividad ya se asignó a este usuario');
    }

    await this.usuarioActividadRepository.save(relacion);
    return `Usuario actividad con ID ${id} actualizada correctamente`;
  }

  async remove(id: number): Promise<string> {
    const result = await this.usuarioActividadRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException(`Usuario actividad con ID ${id} no encontrada`);
    return `Usuario actividad con ID ${id} eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.usuarioActividadRepository.restore(id);
    if (result.affected === 0) throw new NotFoundException(`Usuario actividad con ID ${id} no encontrada`);
    return `Usuario actividad con ID ${id} restaurada correctamente`;
  }
}
