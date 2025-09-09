import { Injectable} from '@nestjs/common';
import { CreateTipoActividadDto } from './dto/create-tipo-actividad.dto';
import { UpdateTipoActividadDto } from './dto/update-tipo-actividad.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoActividad } from './entities/tipo-actividad.entity';

@Injectable()
export class TipoActividadService {
  constructor(
    @InjectRepository(TipoActividad)
    private readonly tipoActividadRepository: Repository<TipoActividad>,
  ) {}

  async create(createTipoActividadDto: CreateTipoActividadDto) {
    const tipoActividad = this.tipoActividadRepository.create(createTipoActividadDto);
    return await this.tipoActividadRepository.save(tipoActividad);
  }

  async findAll() {
    return await this.tipoActividadRepository.find();
  }

  async findOne(id_tipo_actividad_pk: number) {
    return await this.tipoActividadRepository.findOneBy({ id_tipo_actividad_pk });
  }

  async update(id_tipo_actividad_pk: number, UpdateTipoActividadDto: UpdateTipoActividadDto) {
    return await this.tipoActividadRepository.update(id_tipo_actividad_pk, UpdateTipoActividadDto);
  }

  async remove(id_tipo_actividad_pk: number) {
    return await this.tipoActividadRepository.softDelete({ id_tipo_actividad_pk }); //se le pasa el id
    // return await this.cultivoRepository.softRemove({tipoActividad})  // se le pasa la instancia
  }

  async restore(id_tipo_actividad_pk: number) {
    return await this.tipoActividadRepository.restore({ id_tipo_actividad_pk });
  }
}
