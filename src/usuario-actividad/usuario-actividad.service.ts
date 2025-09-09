import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioActividad } from './entities/usuario-actividad.entity';
import { CreateUsuarioActividadDto } from './dto/create-usuario-actividad.dto';
import { UpdateUsuarioActividadDto } from './dto/update-usuario-actividad.dto';

@Injectable()
export class UsuarioActividadService {
  constructor(
    @InjectRepository(UsuarioActividad)
    private readonly UsuarioActividadRepository: Repository<UsuarioActividad>
  ){}
  async create(createDto: CreateUsuarioActividadDto){
    const {dni_usuario_fk, id_actividad_fk} =createDto;

    if (!dni_usuario_fk || !id_actividad_fk) {
      throw new BadRequestException('Todos los campos son obligatorios.');
    }
    const UsuarioActividad = this.UsuarioActividadRepository.create({
      dni_usuario: dni_usuario_fk,
      id_actividad: id_actividad_fk,
    });
     return await this.UsuarioActividadRepository.save(UsuarioActividad);

  }

  async findAll() {
    return await this.UsuarioActividadRepository.find();
  }

  async findOne(id: number) {
    const UsuarioActividad = await this.UsuarioActividadRepository.findOneBy({ id_usuarios_actividades_pk:id});
    if (!UsuarioActividad){
      throw new NotFoundException(`Usuario actividad con ID ${id} no encontrado`);

    }
    return UsuarioActividad;
  }

  async update(id: number, updateDto: UpdateUsuarioActividadDto) {
    const UsuarioActividad = await this.findOne(id);
    const actualizado = this.UsuarioActividadRepository.merge(UsuarioActividad,{
      dni_usuario: updateDto.dni_usuario_fk ?? UsuarioActividad.dni_usuario,
      id_actividad: updateDto.id_actividad_fk ?? UsuarioActividad.id_actividad,

    });

    return await this.UsuarioActividadRepository.save(actualizado);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.UsuarioActividadRepository.softDelete(id);
    return{ message: `Usuario actividad con ID ${id} eliminado correctamente` };
  }
}
 

  

