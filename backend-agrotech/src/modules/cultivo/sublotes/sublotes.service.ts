import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    if (!lote) throw new NotFoundException('Lote no encontrado');

    const sublote = this.subloteRepository.create({
      ...data,
      lote,
    });

    const existeNombre = await this.subloteRepository.findOne({
      where: { nombre_sublote: createSubloteDto.nombre_sublote}
    })
    if (existeNombre) {
      throw new BadRequestException(
        `El numbre del Sublote ya existe`
      )
    }
    try {
      await this.subloteRepository.save(sublote);
      return 'Sublote registrado correctamente';
    } catch (error: any) {
      throw new BadRequestException(`Error al registrar sublote: ${error.message}`);
    }
  }

  async findAll() {
    const sublotes = await this.subloteRepository.find({ relations: ['lote'] });
    if (sublotes.length === 0) return 'No se encontraron sublotes registrados';
    return `Se encontraron ${sublotes.length} sublotes registrados`;
  }

  async findOne(id_sublote_pk: number) {
    const sublote = await this.subloteRepository.findOne({
      where: { id_sublote_pk },
      relations: ['lote'],
    });
    if (!sublote) throw new NotFoundException(`Sublote con ID ${id_sublote_pk} no encontrado`);
    return `Sublote encontrado: '${sublote.nombre_sublote}' (ID: ${id_sublote_pk})`;
  }

  async update(id_sublote_pk: number, updateSubloteDto: UpdateSubloteDto): Promise<string> {
    const sublote = await this.subloteRepository.findOne({
      where: { id_sublote_pk },
      relations: ['lote'],
    });
    if (!sublote) throw new NotFoundException(`Sublote con ID ${id_sublote_pk} no encontrado`);

    // Si viene id_lote_fk, actualizamos el lote; si no, no lo tocamos
    if (updateSubloteDto.id_lote_fk) {
      const lote = await this.loteRepository.findOneBy({ id_lote_pk: updateSubloteDto.id_lote_fk });
      if (!lote) throw new NotFoundException('Lote no encontrado');
      sublote.lote = lote;
    }

    Object.assign(sublote, {
      ...updateSubloteDto,
      id_lote_fk: undefined, // para que no intente guardar FK null
    });

    try {
      await this.subloteRepository.save(sublote);
      return `Sublote con ID ${id_sublote_pk} actualizado correctamente`;
    } catch (error: any) {
      throw new BadRequestException(`Error al actualizar sublote: ${error.message}`);
    }
  }

  async remove(id_sublote_pk: number): Promise<string> {
    const result = await this.subloteRepository.softDelete({ id_sublote_pk });
    if (result.affected === 0) throw new NotFoundException(`Sublote con ID ${id_sublote_pk} no encontrado`);
    return `Sublote con ID ${id_sublote_pk} eliminado correctamente`;
  }

  async restore(id_sublote_pk: number): Promise<string> {
    const result = await this.subloteRepository.restore({ id_sublote_pk });
    if (result.affected === 0) throw new NotFoundException(`Sublote con ID ${id_sublote_pk} no encontrado`);
    return `Sublote con ID ${id_sublote_pk} restaurado correctamente`;
  }
}
