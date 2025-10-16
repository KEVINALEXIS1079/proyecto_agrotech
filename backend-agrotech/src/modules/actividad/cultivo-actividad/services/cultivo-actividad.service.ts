import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CultivoActividad } from '../entities/cultivo-actividad.entity';
import { CreateCultivoActividadDto } from '../dto/create-cultivo-actividad.dto';
import { UpdateCultivoActividadDto } from '../dto/update-cultivo-actividad.dto';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { Actividad } from 'src/modules/actividad/actividades/entities/actividad.entity';

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

  async create(createCultivoActividadDto: CreateCultivoActividadDto): Promise<string> {
    const cultivo = await this.cultivoRepo.findOneBy({ id_cultivo_pk: createCultivoActividadDto.id_cultivo_fk });
    if (!cultivo) throw new NotFoundException(`Cultivo con ID ${createCultivoActividadDto.id_cultivo_fk} no encontrado`);

    const actividad = await this.actividadRepo.findOneBy({ id_actividad_pk: createCultivoActividadDto.id_actividad_fk });
    if (!actividad) throw new NotFoundException(`Actividad con ID ${createCultivoActividadDto.id_actividad_fk} no encontrada`);

    const nuevo = this.repo.create({ cultivo, actividad });

    try {
      await this.repo.save(nuevo);
      return `Cultivo_actividad creada correctamente`;
    } catch (error: any) {
      if (error.code === '23503') {
        throw new NotFoundException('Error de clave foránea: cultivo o actividad no existente');
      }
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<string> {
    const items = await this.repo.find({ relations: ['cultivo', 'actividad'] });
    if (items.length === 0) return 'No se encontraron Cultivo_actividad registradas';
    return `Se encontraron ${items.length} Cultivo_actividad registradas`;
  }

  async findOne(id: number): Promise<string> {
    const item = await this.repo.findOne({
      where: { id_cultivo_actividad_pk: id },
      relations: ['cultivo', 'actividad'],
    });
    if (!item) throw new NotFoundException(`Cultivo_actividad con ID ${id} no encontrada`);
    return `Cultivo_actividad con ID ${id} encontrada (Cultivo ID: ${item.cultivo.id_cultivo_pk}, Actividad ID: ${item.actividad.id_actividad_pk})`;
  }

  async update(id: number, dto: UpdateCultivoActividadDto): Promise<string> {
    const existe = await this.repo.findOne({
      where: { id_cultivo_actividad_pk: id },
      relations: ['cultivo', 'actividad'],
    });
    if (!existe) throw new NotFoundException(`Cultivo_actividad con ID ${id} no encontrada`);

    // Actualizar relaciones si vienen en el DTO
    if (dto.id_cultivo_fk) {
      const cultivo = await this.cultivoRepo.findOneBy({ id_cultivo_pk: dto.id_cultivo_fk });
      if (!cultivo) throw new NotFoundException(`Cultivo con ID ${dto.id_cultivo_fk} no encontrado`);
      existe.cultivo = cultivo;
    }
    if (dto.id_actividad_fk) {
      const actividad = await this.actividadRepo.findOneBy({ id_actividad_pk: dto.id_actividad_fk });
      if (!actividad) throw new NotFoundException(`Actividad con ID ${dto.id_actividad_fk} no encontrada`);
      existe.actividad = actividad;
    }

    try {
      await this.repo.save(existe);
      return `Cultivo_actividad con ID ${id} actualizada correctamente`;
    } catch (error: any) {
      if (error.code === '23503') {
        throw new NotFoundException('Error de clave foránea: cultivo o actividad no existente');
      }
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.repo.softDelete(id);
    if (result.affected === 0) throw new NotFoundException(`Cultivo_actividad con ID ${id} no encontrada`);
    return `Cultivo_actividad con ID ${id} eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.repo.restore(id);
    if (result.affected === 0) throw new NotFoundException(`Cultivo_actividad con ID ${id} no encontrada`);
    return `Cultivo_actividad con ID ${id} restaurada correctamente`;
  }
}
