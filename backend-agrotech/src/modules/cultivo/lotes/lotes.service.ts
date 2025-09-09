import { Injectable} from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lote } from './entities/lote.entity';

@Injectable()
export class LotesService {

  constructor (

    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>
  ) {}

  async create(createLoteDto: CreateLoteDto) {
    const lote = this.loteRepository.create(createLoteDto);
    await this.loteRepository.save(lote);
    return 'Lote registrado correctamente';
  }

  async findAll() {
    return await this.loteRepository.find();
  }

  async findOne(id_lote_pk: number) {
    const lote = await this.loteRepository.findOneBy({ id_lote_pk });
    if (!lote) throw new Error('Lote no encontrado');
    return lote;
  }

  async update(id_lote_pk: number, updateLoteDto: UpdateLoteDto): Promise<string> {
    const lote = await this.findOne(id_lote_pk);
    this.loteRepository.merge(lote, updateLoteDto);
    await this.loteRepository.save(lote);
    return `Lote con ID ${id_lote_pk} actualizado correctamente`;
  }

  async remove(id_lote_pk: number) {
    const result = await this.loteRepository.softDelete({ id_lote_pk });
    if (result.affected === 0) throw new Error('Lote no encontrado');
    return `Lote con ID ${id_lote_pk} eliminado correctamente`;
  }

  async restore(id_lote_pk: number): Promise<string> {
    const result = await this.loteRepository.restore({ id_lote_pk });
    if (result.affected === 0) throw new Error('Lote no encontrado');
    return `Lote con ID ${id_lote_pk} restaurado correctamente`;
  }
}


