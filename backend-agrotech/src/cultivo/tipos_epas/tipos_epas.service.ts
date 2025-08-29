import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoEpa } from './entities/tipos_epa.entity';
import { CreateTiposEpaDto } from './dto/create-tipos_epa.dto';
import { UpdateTiposEpaDto } from './dto/update-tipos_epa.dto';

@Injectable()
export class TiposEpasService {
  constructor(
    @InjectRepository(TipoEpa)
    private readonly tipoEpaRepository: Repository<TipoEpa>,
  ) {}

  async create(dto: CreateTiposEpaDto): Promise<string> {
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

  async update(id_tipo_epa_pk: number, dto: UpdateTiposEpaDto): Promise<string> {
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