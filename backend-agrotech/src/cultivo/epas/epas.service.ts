import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epa } from './entities/epa.entity';
import { CreateEpaDto } from './dto/create-epa.dto';
import { UpdateEpaDto } from './dto/update-epa.dto';
import { TipoEpa } from 'src/cultivo/tipos_epas/entities/tipos_epa.entity';

@Injectable()
export class EpasService {
  constructor(
    @InjectRepository(Epa)
    private readonly epaRepository: Repository<Epa>,

    @InjectRepository(TipoEpa)
    private readonly tipoEpaRepository: Repository<TipoEpa>,
  ) {}

  async create(dto: CreateEpaDto): Promise<string> {
    const tipoEpa = await this.tipoEpaRepository.findOneBy({ id_tipo_epa_pk: dto.id_tipo_epa_fk });
    if (!tipoEpa) throw new Error('El tipo EPA especificado no existe');

    const epa = this.epaRepository.create({
      nombre_epa: dto.nombre_epa,
      descripcion_epa: dto.descripcion_epa,
      estado: dto.estado,
      tipoEpa,
    });

    await this.epaRepository.save(epa);
    return 'EPA registrado correctamente';
  }

  async findAll(): Promise<Epa[]> {
    return this.epaRepository.find({
      relations: ['tipoEpa'],
    });
  }

  async findOne(id: number): Promise<Epa> {
    const epa = await this.epaRepository.findOne({
      where: { id_epa_pk: id },
      relations: ['tipoEpa'],
      withDeleted: true,
    });

    if (!epa) throw new Error('EPA no encontrado');
    return epa;
  }

  async update(id: number, dto: UpdateEpaDto): Promise<string> {
    const epa = await this.epaRepository.findOneBy({ id_epa_pk: id });
    if (!epa) throw new Error('EPA no encontrado');

    if (dto.id_tipo_epa_fk) {
      const tipoEpa = await this.tipoEpaRepository.findOneBy({ id_tipo_epa_pk: dto.id_tipo_epa_fk });
      if (!tipoEpa) throw new Error('El tipo EPA especificado no existe');
      Object.assign(dto, { tipoEpa });
      delete dto.id_tipo_epa_fk;
    }

    Object.assign(epa, dto);
    await this.epaRepository.save(epa);
    return 'EPA actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.epaRepository.softDelete(id);
    if (result.affected === 0) throw new Error('EPA no encontrado');
    return 'EPA eliminado correctamente';
  }

  async restore(id: number): Promise<string> {
    const result = await this.epaRepository.restore(id);
    if (result.affected === 0) throw new Error('EPA no encontrado');
    return 'EPA restaurado correctamente';
  }
}