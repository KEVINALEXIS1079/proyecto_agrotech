import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividades } from './entities/actividades.entity';
import { CreateActividadesDto } from './dto/create-actividades.dto';
import { UpdateActividadesDto } from './dto/update-actividades.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividades)
    private readonly actividadRepository: Repository<Actividades>,
  ) {}

  async create(dto: CreateActividadesDto): Promise<string> {
    const nueva = this.actividadRepository.create({
      estado: dto.estado_actividad,
      descripcion: dto.descripcion_actividad,
      nombre: dto.nombre_actividad,
      tiempo: dto.tiempo_actividad,
      costo_mano_obra: dto.costo_mano_obra_actividad,
      fecha: dto.fecha_actividad,
      fecha_inicio: dto.fecha_inicio_actividad,
      fecha_fin: dto.fecha_fin_actividad,
      id_tipo_actividad: dto.id_tipo_actividad_fk,
    });

    await this.actividadRepository.save(nueva);
    return 'Actividad registrada correctamente';
  }

  async findAll(): Promise<Actividades[]> {
    return await this.actividadRepository.find();
  }

  async findOne(id: number): Promise<Actividades> {
    const actividad = await this.actividadRepository.findOneBy({ id_actividad_pk: id });
    if (!actividad) throw new NotFoundException('Actividad no encontrada');
    return actividad;
  }

  async update(id: number, dto: UpdateActividadesDto): Promise<string> {
    const existente = await this.findOne(id);

    if (dto.estado_actividad) existente.estado = dto.estado_actividad;
    if (dto.descripcion_actividad) existente.descripcion = dto.descripcion_actividad;
    if (dto.nombre_actividad) existente.nombre = dto.nombre_actividad;
    if (dto.tiempo_actividad !== undefined) existente.tiempo = dto.tiempo_actividad;
    if (dto.costo_mano_obra_actividad !== undefined)
      existente.costo_mano_obra = dto.costo_mano_obra_actividad;
    if (dto.fecha_actividad) existente.fecha = dto.fecha_actividad;
    if (dto.fecha_inicio_actividad) existente.fecha_inicio = dto.fecha_inicio_actividad;
    if (dto.fecha_fin_actividad) existente.fecha_fin = dto.fecha_fin_actividad;
    if (dto.id_tipo_actividad_fk) existente.id_tipo_actividad = dto.id_tipo_actividad_fk;

    await this.actividadRepository.save(existente);
    return `Actividad con ID ${id} actualizada correctamente`;
  }

  async remove(id: number): Promise<string> {
    const result = await this.actividadRepository.softDelete(id);
    if (result.affected === 0)
      throw new NotFoundException('Actividad no encontrada');
    return `Actividad con ID ${id} eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.actividadRepository.restore(id);
    if (result.affected === 0)
      throw new NotFoundException('Actividad no encontrada');
    return `Actividad con ID ${id} restaurada correctamente`;
  }
}
