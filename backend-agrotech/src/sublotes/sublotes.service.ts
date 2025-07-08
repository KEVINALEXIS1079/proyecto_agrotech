import { Injectable } from '@nestjs/common';
import { CreateSubloteDto } from './dto/create-sublote.dto';
import { UpdateSubloteDto } from './dto/update-sublote.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sublote } from './entities/sublote.entity';

@Injectable()
export class SublotesService {
  constructor(
    @InjectRepository(Sublote)
    private readonly subloteRepository: Repository<Sublote>,
  ) {}

  async create(createSubloteDto: CreateSubloteDto) {
    const lote = this.subloteRepository.create(createSubloteDto);
    return await this.subloteRepository.save(lote);
  }

  async findAll() {
    return await this.subloteRepository.find();
  }

  async findOne(id_sublote_pk: number) {
    return await this.subloteRepository.findOneBy({ id_sublote_pk });
  }

  async update(id_sublote_pk: number, updateSubloteDto: UpdateSubloteDto) {
    return await this.subloteRepository.update(id_sublote_pk, updateSubloteDto);
  }

  async remove(id_sublote_pk: number) {
    return await this.subloteRepository.softDelete({ id_sublote_pk }); //se le pasa el id
    // return await this.loteRepository.softRemove({lote})  // se le pasa la instancia
  }
}
