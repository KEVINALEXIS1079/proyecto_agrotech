import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoEpa } from './entities/tipo-epa.entity';
import { CreateTipoEpaDto } from './dto/create-tipo-epa.dto';
import { UpdateTipoEpaDto } from './dto/update-tipo-epa.dto';

@Injectable()
export class TipoEpaService {
  constructor(
    @InjectRepository(TipoEpa)
    private readonly tipoEpaRepository: Repository<TipoEpa>,
  ) {}

  async create(dto: CreateTipoEpaDto): Promise<string> {
    const tipo = this.tipoEpaRepository.create(dto);
    await this.tipoEpaRepository.save(tipo);
    return 'Tipo EPA registrado correctamente';
  }

  async findAll(): Promise<TipoEpa[]> {
    return await this.tipoEpaRepository.find({ relations: ['epas'] });
  }

  async findOne(id_tipo_epa_pk: number): Promise<TipoEpa> {
    const tipo = await this.tipoEpaRepository.findOne({
      where: { id_tipo_epa_pk },
      relations: ['epas'],
      withDeleted: true,
    });
    if (!tipo) throw new Error('Tipo EPA no encontrado');
    return tipo;
  }

  async update(id_tipo_epa_pk: number, dto: UpdateTipoEpaDto): Promise<string> {
    const tipo = await this.tipoEpaRepository.findOneBy({ id_tipo_epa_pk });
    if (!tipo) throw new Error('Tipo EPA no encontrado');

    Object.assign(tipo, dto);
    await this.tipoEpaRepository.save(tipo);
    return 'Tipo EPA actualizado correctamente';
  }

  async remove(id_tipo_epa_pk: number): Promise<string> {
    const result = await this.tipoEpaRepository.softDelete({ id_tipo_epa_pk });
    if (result.affected === 0) throw new Error('Tipo EPA no encontrado');
    return 'Tipo EPA eliminado correctamente';
  }

  async restore(id_tipo_epa_pk: number): Promise<string> {
    const result = await this.tipoEpaRepository.restore({ id_tipo_epa_pk });
    if (result.affected === 0) throw new Error('Tipo EPA no encontrado');
    return 'Tipo EPA restaurado correctamente';
  }
}