import { Injectable } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lote } from './entities/lote.entity';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  async create(dto: CreateLoteDto) {
    const lote = this.loteRepository.create(dto);
    return await this.loteRepository.save(lote);
  }

  async findAll() {
    return await this.loteRepository.find();
  }

  async findOne(id_lote_pk: number) {
    return await this.loteRepository.findOneBy({ id_lote_pk });
  }

  async update(id_lote_pk: number, dto: UpdateLoteDto) {
    return await this.loteRepository.update(id_lote_pk, dto);
  }

  async remove(id_lote_pk: number) {
    return await this.loteRepository.softDelete({ id_lote_pk }); //se le pasa el id
    // return await this.loteRepository.softRemove({lote})  // se le pasa la instancia
  }

  //resturar los datos eliminados
  async restore(id_lote_pk: number): Promise<UpdateResult> {
    return this.loteRepository.restore({ id_lote_pk });
  }
}
