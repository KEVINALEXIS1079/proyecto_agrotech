import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidencia } from './entities/evidencia.entity';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';

@Injectable()
export class EvidenciasService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly evidenciaRepository: Repository<Evidencia>,
  ){}
  async create(createDto:CreateEvidenciaDto){
    const{descripcion_evidencia, fecha_evidencia, observacion_evidencia,fecha_inicio_evidencia, fecha_fin_evidencia, id_actividad_fk, ruta_imagen } = createDto;
     
    if (! descripcion_evidencia|| !fecha_evidencia || !observacion_evidencia || !fecha_inicio_evidencia || !fecha_fin_evidencia || !id_actividad_fk || !ruta_imagen) {
      throw new BadRequestException('Todos los campos son obligatorios.');
    }
    const evidencia = this.evidenciaRepository.create({
      descripcion: descripcion_evidencia,
      fecha: fecha_evidencia,
      observacion: observacion_evidencia,
      fecha_inicio: fecha_inicio_evidencia,
      fecha_fin: fecha_fin_evidencia,
      id_actividad: id_actividad_fk,
      imagen: ruta_imagen,

    });
    return await this.evidenciaRepository.save(evidencia)
  }

  async findAll() {
    return await this.evidenciaRepository.find();
  }

  async findOne(id: number) {
    const evidencia = await this.evidenciaRepository.findOneBy({id_evidencia_pk: id});
    if(!evidencia){
      throw new NotFoundException(`Evidencia con ID ${id} no encontrada`)
    }
    return evidencia;
  }

  async update(id: number, updateDto: UpdateEvidenciaDto) {
    const evidencia = await this.findOne(id);
    const actualizado = this.evidenciaRepository.merge(evidencia, {
      descripcion: updateDto.descripcion_evidencia ?? evidencia.descripcion,
      fecha: updateDto.fecha_evidencia ?? evidencia.fecha,
      observacion: updateDto.observacion_evidencia ?? evidencia.observacion,
      fecha_inicio: updateDto.fecha_inicio_evidencia ?? evidencia.fecha_inicio,
      fecha_fin: updateDto.fecha_fin_evidencia ?? evidencia.fecha_fin,
      id_actividad: updateDto.id_actividad_fk ?? evidencia.id_actividad,
      imagen: updateDto.ruta_imagen ?? evidencia.imagen,
    });

    return await this.evidenciaRepository.save(actualizado);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.evidenciaRepository.softDelete(id);
    return { message: `Evidencia con ID ${id} eliminada correctamente` };
  }
}

 