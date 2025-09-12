import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from './entities/actividad.entity';
import { CreateActividadDto } from './dto/create-actividad.dto';
import { UpdateActividadDto } from './dto/update-actividad.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
  ) {}

  async create(createActividadDto: CreateActividadDto): Promise<string> {
    const nueva = this.actividadRepository.create({
      estado_actividad: createActividadDto.estado_actividad,
      descripcion_actividad: createActividadDto.descripcion_actividad,
      nombre_actividad: createActividadDto.nombre_actividad,
      tiempo_actividad: createActividadDto.tiempo_actividad,
      costo_mano_obra_actividad: createActividadDto.costo_mano_obra_actividad,
      fecha_actividad: createActividadDto.fecha_actividad,
      fecha_inicio_actividad: createActividadDto.fecha_inicio_actividad,
      fecha_fin_actividad: createActividadDto.fecha_fin_actividad,
      tipoActividad: {
        id_tipo_actividad_pk: createActividadDto.id_tipo_actividad_fk,
      } as any,
    });

    const existeNombre = await this.actividadRepository.findOne({
      where: { nombre_actividad: createActividadDto.nombre_actividad}
    })
    if (existeNombre) {
      throw new BadRequestException(
        `El nombre de la catividad ya existe`
      )
    }
    try {
      await this.actividadRepository.save(nueva);
      return 'Actividad registrada correctamente';
    } catch (error: any) {
      if (error.code ) {
        // Error de clave foránea
        throw new NotFoundException(
          `El Tipo de Actividad especificado no existe`,
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Actividad[]> {
    return await this.actividadRepository.find({
      relations: ['tipoActividad', 'usuarioActividad', 'movimientos', 'evidencias', 'cultivosActividades'],
    });
  }

  async findOne(id: number): Promise<Actividad> {
    const actividad = await this.actividadRepository.findOne({
      where: { id_actividad_pk: id },
      relations: ['tipoActividad', 'usuarioActividad', 'movimientos', 'evidencias', 'cultivosActividades'],
    });

    if (!actividad) throw new NotFoundException('Actividad no encontrada');
    return actividad;
  }

  async update(id: number, updateActividadDto: UpdateActividadDto): Promise<string> {
    const existente = await this.findOne(id);

    if (updateActividadDto.estado_actividad) existente.estado_actividad = updateActividadDto.estado_actividad;
    if (updateActividadDto.descripcion_actividad) existente.descripcion_actividad = updateActividadDto.descripcion_actividad;
    if (updateActividadDto.nombre_actividad) existente.nombre_actividad = updateActividadDto.nombre_actividad;
    if (updateActividadDto.tiempo_actividad !== undefined) existente.tiempo_actividad = updateActividadDto.tiempo_actividad;
    if (updateActividadDto.costo_mano_obra_actividad !== undefined) existente.costo_mano_obra_actividad = updateActividadDto.costo_mano_obra_actividad;
    if (updateActividadDto.fecha_actividad) existente.fecha_actividad = updateActividadDto.fecha_actividad;
    if (updateActividadDto.fecha_inicio_actividad) existente.fecha_inicio_actividad = updateActividadDto.fecha_inicio_actividad;
    if (updateActividadDto.fecha_fin_actividad) existente.fecha_fin_actividad = updateActividadDto.fecha_fin_actividad;
    if (updateActividadDto.id_tipo_actividad_fk)
      existente.tipoActividad = {
        id_tipo_actividad_pk: updateActividadDto.id_tipo_actividad_fk,
      } as any;

    try {
      await this.actividadRepository.save(existente);
      return `Actividad con ID ${id} actualizada correctamente`;
    } catch (error: any) {
      if (error.code === '23503') {
        throw new NotFoundException(
          `El Tipo de actividad especificado no existe`,
        );
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.actividadRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException('Actividad no encontrada');
    return `Actividad eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.actividadRepository.restore(id);
    if (result.affected === 0) throw new NotFoundException('Actividad no encontrada');
    return `Actividad con ID ${id} restaurada correctamente`;
  }
}
