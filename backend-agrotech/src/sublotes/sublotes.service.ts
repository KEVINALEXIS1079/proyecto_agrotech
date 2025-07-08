import { Injectable } from '@nestjs/common';
import { CreateSubloteDto } from './dto/create-sublote.dto';
import { UpdateSubloteDto } from './dto/update-sublote.dto';
import { Repository, UpdateResult} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sublote } from './entities/sublote.entity';

@Injectable()
export class SublotesService {
  constructor(
    @InjectRepository(Sublote)
    private readonly subloteRepository: Repository<Sublote>,
  ) {}

  async create(dto: CreateSubloteDto) {
    const nuevoLote = this.subloteRepository.create(dto);
    return await this.subloteRepository.save(nuevoLote);
  }

  async findAll() {
    return await this.subloteRepository.find();
  }

  async findOne(id_sublote_pk: number) {
    return await this.subloteRepository.findOneBy({ id_sublote_pk });
  }

  async update(id_sublote_pk: number, dto: UpdateSubloteDto) {
    return await this.subloteRepository.update(id_sublote_pk, dto);
  }

  async remove(id_sublote_pk: number) {
    return await this.subloteRepository.softDelete({ id_sublote_pk }); //se le pasa el id
    // return await this.loteRepository.softRemove({lote})  // se le pasa la instancia
  }

  //resturar los datos eliminados
  async restore(id_sublote_pk: number): Promise<UpdateResult> {
    return this.subloteRepository.restore({ id_sublote_pk });
  }
}
