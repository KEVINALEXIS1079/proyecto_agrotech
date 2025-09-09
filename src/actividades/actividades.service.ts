import { Injectable,NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividades } from './entities/actividades.entity';
import { CreateActividadesDto } from './dto/create-actividades.dto';
import { UpdateActividadesDto } from './dto/update-actividades.dto';


@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividades)
    private readonly actividadRepository:Repository<Actividades>,
  ){}
  //crear
  async create(createDto:CreateActividadesDto) {
    const{ estado_actividad, descripcion_actividad, nombre_actividad, tiempo_actividad, costo_mano_obra_actividad, fecha_actividad, fecha_inicio_actividad, fecha_fin_actividad, id_tipo_actividad_fk } = createDto;

    if ( !estado_actividad || !descripcion_actividad || !nombre_actividad || !nombre_actividad || !tiempo_actividad || !costo_mano_obra_actividad || !fecha_actividad || !fecha_inicio_actividad || !fecha_fin_actividad || !id_tipo_actividad_fk ) {
      throw new BadRequestException('Todos los campos son obligatorios.');
    }
     const actividad = this.actividadRepository.create({
          
      estado: estado_actividad,
      descripcion: descripcion_actividad,
      nombre: nombre_actividad,
      tiempo: tiempo_actividad,
      costo_mano_obra: costo_mano_obra_actividad,
      fecha: fecha_actividad,
      fecha_inicio: fecha_inicio_actividad,
      fecha_fin: fecha_fin_actividad,
      id_tipo_actividad: id_tipo_actividad_fk,
     });

     return await this.actividadRepository.save(actividad);
  }

  
  
  async findAll() {
    return await this.actividadRepository.find();
  }

  
  async findOne(id: number) {
    const actividad = await this.actividadRepository.findOneBy({ id_actividad_pk: id});
    if(!actividad) {
      throw new NotFoundException(`actividad con ID ${id} no encontrada`);
    }
    return actividad;
  }

  async update(id: number, updateDto: UpdateActividadesDto) {
    const actividad = await this.findOne(id);
    const actualizado = this.actividadRepository.merge(actividad, {
      estado: updateDto.estado_actividad ?? actividad.estado,
      descripcion: updateDto.descripcion_actividad?? actividad.descripcion,
      nombre: updateDto.nombre_actividad ?? actividad.nombre,
      tiempo: updateDto.tiempo_actividad ?? actividad.tiempo,
      costo_mano_obra: updateDto.costo_mano_obra_actividad ?? actividad.costo_mano_obra,
      fecha: updateDto.fecha_actividad ?? actividad.fecha,
      fecha_inicio: updateDto.fecha_inicio_actividad ?? actividad.fecha_inicio,
      fecha_fin: updateDto.fecha_fin_actividad ?? actividad.fecha_fin,
      id_tipo_actividad: updateDto.id_tipo_actividad_fk ?? actividad.id_tipo_actividad,

    });
    return await this.actividadRepository.save(actualizado);
  }


  async remove(id: number) {
    await this.findOne(id);
    await this.actividadRepository.softDelete(id);

    return {message: `Actividad con ID ${id} eliminada correctamente`};
  }
}
 
  


