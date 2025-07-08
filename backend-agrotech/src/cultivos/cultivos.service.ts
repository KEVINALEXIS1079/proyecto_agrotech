import { Injectable } from '@nestjs/common';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultivo } from './entities/cultivo.entity';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
  ) {}

  async create(dto: CreateCultivoDto) {
    const nuevoCultivo = this.cultivoRepository.create(dto);
    return await this.cultivoRepository.save(nuevoCultivo);
  }

  async findAll() {
    return await this.cultivoRepository.find();
  }

  async findOne(id_cultivo_pk: number) {
    return await this.cultivoRepository.findOneBy({ id_cultivo_pk });
  }

  async update(id_cultivo_pk: number, dto: UpdateCultivoDto) {
    return await this.cultivoRepository.update(id_cultivo_pk, dto);
  }

  async remove(id_cultivo_pk: number) {
    return await this.cultivoRepository.softDelete({ id_cultivo_pk }); //se le pasa el id
    // return await this.cultivoRepository.softRemove({Cultivo})  // se le pasa la instancia
  }

  //resturar los datos eliminados
  async restore(id_cultivo_pk: number): Promise<UpdateResult> {
    return this.cultivoRepository.restore({ id_cultivo_pk });
  }
}
