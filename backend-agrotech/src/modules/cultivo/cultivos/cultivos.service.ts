import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { Sublote } from '../sublotes/entities/sublote.entity';
import { TipoCultivo } from '../tipo-cultivo/entities/tipo-cultivo.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,

    @InjectRepository(Sublote)
    private readonly subloteRepository: Repository<Sublote>,

    @InjectRepository(TipoCultivo)
    private readonly tipoCultivoRepository: Repository<TipoCultivo>,
  ) {}

  async create(createCultivoDto: CreateCultivoDto): Promise<string> {
    const { id_sublote_fk, id_tipo_cultivo_fk, ...data } = createCultivoDto;

    // Validar sublote
    const sublote = await this.subloteRepository.findOneBy({ id_sublote_pk: id_sublote_fk });
    if (!sublote) throw new Error('Sublote no encontrado');

    // Validar tipo de cultivo
    const tipoCultivo = await this.tipoCultivoRepository.findOneBy({ id_tipo_cultivo_pk: id_tipo_cultivo_fk });
    if (!tipoCultivo) throw new Error('Tipo de cultivo no encontrado');

    // Crear el cultivo con relaciones
    const cultivo = this.cultivoRepository.create({
      ...data,
      sublote,
      tipoCultivo,
    });

    await this.cultivoRepository.save(cultivo);
    return 'Cultivo registrado correctamente';
  }

  async findAll() {
    return await this.cultivoRepository.find({
      relations: ['sublote', 'tipoCultivo'],
    });
  }

  async findOne(id_cultivo_pk: number) {
    const cultivo = await this.cultivoRepository.findOne({
      where: { id_cultivo_pk },
      relations: ['sublote', 'tipoCultivo'],
    });
    if (!cultivo) throw new Error('Cultivo no encontrado');
    return cultivo;
  }

  async update(id_cultivo_pk: number, updateCultivoDto: UpdateCultivoDto): Promise<string> {
    const cultivo = await this.findOne(id_cultivo_pk);
    this.cultivoRepository.merge(cultivo, updateCultivoDto);
    await this.cultivoRepository.save(cultivo);
    return `Cultivo con ID ${id_cultivo_pk} actualizado correctamente`;
  }

  async remove(id_cultivo_pk: number): Promise<string> {
    const result = await this.cultivoRepository.softDelete({ id_cultivo_pk });
    if (result.affected === 0) throw new Error('Cultivo no encontrado');
    return `Cultivo con ID ${id_cultivo_pk} eliminado correctamente`;
  }

  async restore(id_cultivo_pk: number): Promise<string> {
    const result = await this.cultivoRepository.restore({ id_cultivo_pk });
    if (result.affected === 0) throw new Error('Cultivo no encontrado');
    return `Cultivo con ID ${id_cultivo_pk} restaurado correctamente`;
  }
}
