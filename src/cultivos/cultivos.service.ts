import { Injectable} from '@nestjs/common';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cultivo } from './entities/cultivo.entity';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
  ) {}

  async create(createCultivoDto: CreateCultivoDto) {
    const cultivo = this.cultivoRepository.create(createCultivoDto);
    return await this.cultivoRepository.save(cultivo);
  }

  async findAll() {
    return await this.cultivoRepository.find();
  }

  async findOne(id_cultivo_pk: number) {
    return await this.cultivoRepository.findOneBy({ id_cultivo_pk });
  }

  async update(id_cultivo_pk: number, updateCultivoDto: UpdateCultivoDto) {
    return await this.cultivoRepository.update(id_cultivo_pk, updateCultivoDto);
  }

  async remove(id_cultivo_pk: number) {
    return await this.cultivoRepository.softDelete({ id_cultivo_pk }); //se le pasa el id
    // return await this.cultivoRepository.softRemove({Cultivo})  // se le pasa la instancia
  }
}
