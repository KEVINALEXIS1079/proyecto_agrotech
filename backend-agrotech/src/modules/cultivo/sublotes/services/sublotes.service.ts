import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sublote } from '../entities/sublote.entity';
import { Lote } from '../../lotes/entities/lote.entity';
import { CreateSubloteDto } from '../dto/create-sublote.dto';
import { UpdateSubloteDto } from '../dto/update-sublote.dto';
import { getAreaOfPolygon } from 'geolib'; // npm i geolib

@Injectable()
export class SublotesService {
  constructor(
    @InjectRepository(Sublote)
    private readonly subloteRepository: Repository<Sublote>,

    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  /**
   * Calcula el área de un polígono (sublote) a partir de sus coordenadas.
   */
  private calcularArea(
    coordenadas: { latitud_sublote: number; longitud_sublote: number }[],
  ): number {
    if (!coordenadas || coordenadas.length < 3) {
      throw new BadRequestException(
        'Se requieren al menos 3 coordenadas para calcular el área del sublote.',
      );
    }

    const coordsForGeolib = coordenadas.map(coord => ({
      latitude: coord.latitud_sublote,
      longitude: coord.longitud_sublote,
    }));

    return getAreaOfPolygon(coordsForGeolib);
  }

  /**
   * Crea un nuevo sublote dentro de un lote.
   */
  async create(createSubloteDto: CreateSubloteDto): Promise<Sublote> {
    const { id_lote_fk, ...data } = createSubloteDto;

    if (!data.nombre_sublote?.trim()) {
      throw new BadRequestException('El nombre del sublote es obligatorio.');
    }

    const lote = await this.loteRepository.findOne({
      where: { id_lote_pk: id_lote_fk },
    });

    if (!lote) throw new NotFoundException('Lote no encontrado.');

    const areaCalculada = this.calcularArea(data.coordenadas_sublote);

    const existeNombre = await this.subloteRepository.findOne({
      where: { nombre_sublote: data.nombre_sublote },
    });
    if (existeNombre) {
      throw new BadRequestException('Ya existe un sublote con este nombre.');
    }

    const sublote = this.subloteRepository.create({
      ...data,
      lote,
      area_sublote: areaCalculada,
    });

    try {
      return await this.subloteRepository.save(sublote);
    } catch (error: any) {
      throw new BadRequestException(
        `Error al registrar sublote: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene todos los sublotes.
   */
  async findAll(): Promise<Sublote[]> {
    return await this.subloteRepository.find({
      relations: ['lote'],
      order: { id_sublote_pk: 'ASC' },
    });
  }

  /**
   * Obtiene un sublote específico.
   */
  async findOne(id_sublote_pk: number): Promise<Sublote> {
    const sublote = await this.subloteRepository.findOne({
      where: { id_sublote_pk },
      relations: ['lote'],
    });
    if (!sublote)
      throw new NotFoundException(`Sublote con ID ${id_sublote_pk} no encontrado.`);
    return sublote;
  }

  /**
   * Actualiza un sublote.
   */
  async update(
    id_sublote_pk: number,
    updateSubloteDto: UpdateSubloteDto,
  ): Promise<Sublote> {
    const sublote = await this.findOne(id_sublote_pk);

    if (updateSubloteDto.nombre_sublote !== undefined) {
      sublote.nombre_sublote = updateSubloteDto.nombre_sublote;
    }

    if (updateSubloteDto.id_lote_fk) {
      const lote = await this.loteRepository.findOne({
        where: { id_lote_pk: updateSubloteDto.id_lote_fk },
      });
      if (!lote) throw new NotFoundException('Lote no encontrado.');
      sublote.lote = lote;
    }

    if (updateSubloteDto.coordenadas_sublote !== undefined) {
      sublote.coordenadas_sublote = updateSubloteDto.coordenadas_sublote;
      sublote.area_sublote = this.calcularArea(
        updateSubloteDto.coordenadas_sublote,
      );
    }

    if (updateSubloteDto.area_sublote !== undefined) {
      sublote.area_sublote = updateSubloteDto.area_sublote;
    }

    try {
      return await this.subloteRepository.save(sublote);
    } catch (error: any) {
      throw new BadRequestException(
        `Error al actualizar sublote: ${error.message}`,
      );
    }
  }

  /**
   * Elimina (soft delete) un sublote.
   */
  async remove(id_sublote_pk: number): Promise<{ id_sublote_pk: number }> {
    const result = await this.subloteRepository.softDelete(id_sublote_pk);
    if (result.affected === 0)
      throw new NotFoundException(
        `Sublote con ID ${id_sublote_pk} no encontrado.`,
      );
    return { id_sublote_pk };
  }

  /**
   * Restaura un sublote eliminado.
   */
  async restore(id_sublote_pk: number): Promise<Sublote> {
    await this.subloteRepository.restore(id_sublote_pk);
    const sublote = await this.findOne(id_sublote_pk);
    return sublote;
  }
}
