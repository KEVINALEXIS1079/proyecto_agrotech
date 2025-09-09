import { Injectable,NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoActividad } from './entities/tipo-actividad.entity';
import { CreateTipoActividadDto } from './dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from './dto/update-tipo-actividad.dto';

@Injectable()
export class TipoActividadService {
  constructor(
    @InjectRepository(TipoActividad)
    private readonly TipoActividadRepository:Repository<TipoActividad>,
  ){}
  async create(createDto:CreateTipoActividadDto){
    const{nombre_tipo_actividad} = createDto;

    if ( !nombre_tipo_actividad ) {
      throw new BadRequestException('Este campo es obligatorio.');
    }
    const TipoActividad = this.TipoActividadRepository.create({
      nombre: nombre_tipo_actividad
    });
    return await this.TipoActividadRepository.save(TipoActividad);
  }

  async findAll() {
    return await this.TipoActividadRepository.find();
  }

  async findOne(id: number) {
    const TipoActividad = await this.TipoActividadRepository.findOneBy({id_tipo_actividad_pk: id});
    if(!TipoActividad){
      throw new NotFoundException(`tipo de actividad con ID ${id} no encontrada`)

    }
    return TipoActividad;
  }

  async update(id: number, updateDto: UpdateTipoActividadDto) {
    const TipoActividad = await this.findOne(id);
    const actualizado = this.TipoActividadRepository.merge(TipoActividad, {
      nombre: updateDto.nombre_tipo_actividad ?? TipoActividad.nombre,
    });
    return await this.TipoActividadRepository.save(actualizado);
  }

  async remove(id: number) {
    await this.findOne(id);
    await  this.TipoActividadRepository.softDelete(id);
    return {message: `Tipo de actividad con ID ${id} eliminada correctamente`};
}

}




 
  


