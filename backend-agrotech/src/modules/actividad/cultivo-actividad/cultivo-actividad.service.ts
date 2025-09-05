import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CultivoActividad } from './entities/cultivo-actividad.entity';
import { CreateCultivoActividadDto } from './dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from './dto/update-cultivo-actividad.dto';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { Actividad } from 'src/modules/actividad/actividades/entities/actividades.entity';

@Injectable()
export class CultivoActividadService {
  constructor(
    @InjectRepository(CultivoActividad)
    private readonly repo: Repository<CultivoActividad>,

    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,

    @InjectRepository(Actividad)
    private readonly actividadRepo: Repository<Actividad>,
  ) {}

  async create(dto: CreateCultivoActividadDto): Promise<CultivoActividad> {
    const cultivo = await this.cultivoRepo.findOneBy({ id_cultivo_pk: dto.id_cultivo_fk });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');

    const actividad = await this.actividadRepo.findOneBy({ id_actividad_pk: dto.id_actividad_fk });
    if (!actividad) throw new NotFoundException('Actividad no encontrada');

    const nuevo = this.repo.create({ cultivo, actividad });
    return await this.repo.save(nuevo);
  }

  async findAll(): Promise<CultivoActividad[]> {
    return await this.repo.find();
  }

  async findOne(id: number): Promise<CultivoActividad> {
    const item = await this.repo.findOneBy({ id_cultivo_actividad_pk: id });
    if (!item) throw new NotFoundException('Cultivo_actividad no encontrada');
    return item;
  }

  async update(id: number, dto: UpdateCultivoActividadDto): Promise<string> {
    const existe = await this.findOne(id);
    Object.assign(existe, dto);
    await this.repo.save(existe);
    return `Cultivo_actividad con ID ${id} actualizada correctamente`;
  }

  async remove(id: number): Promise<string> {
    const result = await this.repo.softDelete(id);
    if (result.affected === 0)
      throw new NotFoundException('Cultivo_actividad no encontrada');
    return `Cultivo_actividad con ID ${id} eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.repo.restore(id);
    if (result.affected === 0)
      throw new NotFoundException('Cultivo_actividad no encontrada');
    return `Cultivo_actividad con ID ${id} restaurada correctamente`;
  }
}
