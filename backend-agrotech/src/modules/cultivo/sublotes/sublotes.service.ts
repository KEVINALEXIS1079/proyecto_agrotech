import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sublote } from './entities/sublote.entity';
import { Lote } from '../lotes/entities/lote.entity';
import { CreateSubloteDto } from './dto/create-sublote.dto';
import { UpdateSubloteDto } from './dto/update-sublote.dto';

@Injectable()
export class SublotesService {
  constructor(
    @InjectRepository(Sublote)
    private readonly subloteRepository: Repository<Sublote>,

    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  async create(createSubloteDto: CreateSubloteDto): Promise<string> {
    const { id_lote_fk, ...data } = createSubloteDto;

    const lote = await this.loteRepository.findOneBy({ id_lote_pk: id_lote_fk });
    if (!lote) throw new Error('Lote no encontrado');

    const sublote = this.subloteRepository.create({
      ...data,
      lote,
    });

    await this.subloteRepository.save(sublote);
    return 'Sublote registrado correctamente';
  }

  async findAll() {
    return await this.subloteRepository.find({ relations: ['lote'] });
  }

  async findOne(id_sublote_pk: number) {
    const sublote = await this.subloteRepository.findOne({
      where: { id_sublote_pk },
      relations: ['lote'],
    });
    if (!sublote) throw new Error('Sublote no encontrado');
    return sublote;
  }

  async update(id_sublote_pk: number, updateSubloteDto: UpdateSubloteDto): Promise<string> {
    const sublote = await this.findOne(id_sublote_pk);
    this.subloteRepository.merge(sublote, updateSubloteDto);
    await this.subloteRepository.save(sublote);
    return `Sublote con ID ${id_sublote_pk} actualizado correctamente`;
  }

  async remove(id_sublote_pk: number): Promise<string> {
    const result = await this.subloteRepository.softDelete({ id_sublote_pk });
    if (result.affected === 0) throw new Error('Sublote no encontrado');
    return `Sublote con ID ${id_sublote_pk} eliminado correctamente`;
  }

  async restore(id_sublote_pk: number): Promise<string> {
    const result = await this.subloteRepository.restore({ id_sublote_pk });
    if (result.affected === 0) throw new Error('Sublote no encontrado');
    return `Sublote con ID ${id_sublote_pk} restaurado correctamente`;
  }
}
