import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Epa } from '../entities/epa.entity';
import { CreateEpaDto } from '../dto/create-epa.dto';
import { UpdateEpaDto } from '../dto/update-epa.dto';
import { TipoEpa } from '../../tipo-epa/entities/tipo-epa.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';

@Injectable()
export class EpasService {
  constructor(
    @InjectRepository(Epa)
    private readonly epaRepository: Repository<Epa>,

    @InjectRepository(TipoEpa)
    private readonly tipoEpaRepository: Repository<TipoEpa>,

    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
  ) {}

  async create(createEpaDto: CreateEpaDto): Promise<string> {
    const tipoEpa = await this.tipoEpaRepository.findOneBy({ id_tipo_epa_pk: createEpaDto.id_tipo_epa_fk });
    if (!tipoEpa) throw new BadRequestException('El tipo de EPA especificado no existe');

    const cultivo = await this.cultivoRepository.findOneBy({ id_cultivo_pk: createEpaDto.id_cultivo_fk });
    if (!cultivo) throw new BadRequestException('El cultivo especificado no existe');

    const epa = this.epaRepository.create({
      nombre_epa: createEpaDto.nombre_epa,
      descripcion_epa: createEpaDto.descripcion_epa,
      estado: createEpaDto.estado,
      tipoEpa,
      cultivo,
    });

    const existeNombre= await this.epaRepository.findOne({
      where: { nombre_epa: createEpaDto.nombre_epa}
    })
    if (existeNombre) {
      throw new BadRequestException(
        `El nombre de la Epa ya existe`
      )
    }
    await this.epaRepository.save(epa);
    return 'EPA registrado correctamente';
  }

  async findAll(): Promise<Epa[]> {
    const epas = await this.epaRepository.find({ relations: ['tipoEpa', 'cultivo'] });
    if (!epas || epas.length === 0) throw new NotFoundException('No se encontraron EPAs registrados');
    return epas;
  }

  async findOne(id_epa_pk: number): Promise<Epa> {
    const epa = await this.epaRepository.findOne({
      where: { id_epa_pk },
      relations: ['tipoEpa', 'cultivo'],
      withDeleted: true,
    });
    if (!epa) throw new NotFoundException(`EPA con ID ${id_epa_pk} no encontrado`);
    return epa;
  }

  async update(id_epa_pk: number, dto: UpdateEpaDto): Promise<string> {
    const epa = await this.epaRepository.findOneBy({ id_epa_pk });
    if (!epa) throw new NotFoundException(`EPA con ID ${id_epa_pk} no encontrado`);

    if (dto.id_tipo_epa_fk) {
      const tipoEpa = await this.tipoEpaRepository.findOneBy({ id_tipo_epa_pk: dto.id_tipo_epa_fk });
      if (!tipoEpa) throw new BadRequestException('El tipo de EPA especificado no existe');
      Object.assign(dto, { tipoEpa });
      delete dto.id_tipo_epa_fk;
    }

    if (dto.id_cultivo_fk) {
      const cultivo = await this.cultivoRepository.findOneBy({ id_cultivo_pk: dto.id_cultivo_fk });
      if (!cultivo) throw new BadRequestException('El cultivo especificado no existe');
      Object.assign(dto, { cultivo });
      delete dto.id_cultivo_fk;
    }

    Object.assign(epa, dto);
    await this.epaRepository.save(epa);
    return `EPA con ID ${id_epa_pk} actualizado correctamente`;
  }

  async remove(id_epa_pk: number): Promise<string> {
    const result = await this.epaRepository.softDelete({ id_epa_pk });
    if (result.affected === 0) throw new NotFoundException(`EPA con ID ${id_epa_pk} no encontrado`);
    return `EPA con ID ${id_epa_pk} eliminado correctamente`;
  }

  async restore(id_epa_pk: number): Promise<string> {
    const result = await this.epaRepository.restore({ id_epa_pk });
    if (result.affected === 0) throw new NotFoundException(`EPA con ID ${id_epa_pk} no encontrado`);
    return `EPA con ID ${id_epa_pk} restaurado correctamente`;
  }
}
