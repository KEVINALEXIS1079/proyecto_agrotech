import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTipoActividadDto } from 'src/modules/actividad/tipo-actividad/dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from 'src/modules/actividad/tipo-actividad/dto/update-tipo-actividad.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoActividad } from 'src/modules/actividad/tipo-actividad/entities/tipo-actividad.entity';

@Injectable()
export class TipoActividadService {
  constructor(
    @InjectRepository(TipoActividad)
    private readonly tipoActividadRepository: Repository<TipoActividad>,
  ) {}

  async create(dto: CreateTipoActividadDto): Promise<string> {
    // validar nombre único
    const existeNombre = await this.tipoActividadRepository.findOne({
      where: { nombre_tipo_actividad: dto.nombre_tipo_actividad },
    });
    if (existeNombre) {
      throw new BadRequestException(`El nombre del Tipo de Actividad ya existe`);
    }

    const nuevo = this.tipoActividadRepository.create(dto);
    await this.tipoActividadRepository.save(nuevo);
    return 'TipoActividad registrado correctamente';
  }

  async findAll(): Promise<TipoActividad[]> {
    const registros = await this.tipoActividadRepository.find({ withDeleted: true });

    if (!registros || registros.length === 0) {
      throw new NotFoundException('No se encontraron Tipos de Actividad registrados');
    }
    return registros;
  }

  async findOne(id_tipo_actividad_pk: number): Promise<TipoActividad> {
    const registro = await this.tipoActividadRepository.findOne({
      where: { id_tipo_actividad_pk },
      withDeleted: true,
    });

    if (!registro) {
      throw new NotFoundException(`TipoActividad con ID ${id_tipo_actividad_pk} no encontrado`);
    }
    return registro;
  }

  async update(id_tipo_actividad_pk: number, dto: UpdateTipoActividadDto): Promise<string> {
    const existente = await this.tipoActividadRepository.findOneBy({ id_tipo_actividad_pk });
    if (!existente) {
      throw new NotFoundException(`TipoActividad con ID ${id_tipo_actividad_pk} no encontrado`);
    }

    // validar nombre único si se cambia
    if (dto.nombre_tipo_actividad) {
      const existeNombre = await this.tipoActividadRepository.findOne({
        where: { nombre_tipo_actividad: dto.nombre_tipo_actividad },
      });
      if (existeNombre && existeNombre.id_tipo_actividad_pk !== id_tipo_actividad_pk) {
        throw new BadRequestException(`El nombre del Tipo de Actividad ya existe`);
      }
    }

    Object.assign(existente, dto);
    await this.tipoActividadRepository.save(existente);

    return `TipoActividad con ID ${id_tipo_actividad_pk} actualizado correctamente`;
  }

  async remove(id_tipo_actividad_pk: number): Promise<string> {
    const result = await this.tipoActividadRepository.softDelete({ id_tipo_actividad_pk });
    if (result.affected === 0) {
      throw new NotFoundException(`TipoActividad con ID ${id_tipo_actividad_pk} no encontrado`);
    }
    return `TipoActividad con ID ${id_tipo_actividad_pk} eliminado correctamente`;
  }

  async restore(id_tipo_actividad_pk: number): Promise<string> {
    const result = await this.tipoActividadRepository.restore({ id_tipo_actividad_pk });
    if (result.affected === 0) {
      throw new NotFoundException(`TipoActividad con ID ${id_tipo_actividad_pk} no encontrado`);
    }
    return `TipoActividad con ID ${id_tipo_actividad_pk} restaurado correctamente`;
  }
}
