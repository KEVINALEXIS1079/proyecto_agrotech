import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from '../entities/lote.entity';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { UpdateLoteDto } from '../dto/update-lote.dto';
import { getAreaOfPolygon } from 'geolib'; // npm i geolib

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepository: Repository<Lote>,
  ) {}

  private calcularArea(
    coordenadas: { latitud_lote: number; longitud_lote: number }[],
  ): number {
    if (!coordenadas || coordenadas.length < 3) {
      throw new BadRequestException(
        'Se requieren al menos 3 coordenadas para calcular el área del lote',
      );
    }

    const coordsForGeolib = coordenadas.map(coord => ({
      latitude: coord.latitud_lote,
      longitude: coord.longitud_lote,
    }));

    return getAreaOfPolygon(coordsForGeolib);
  }

  async create(createLoteDto: CreateLoteDto): Promise<Lote> {
    if (!createLoteDto.nombre_lote?.trim()) {
      throw new BadRequestException('El nombre del lote es obligatorio');
    }

    const areaCalculada = this.calcularArea(createLoteDto.coordenadas_lote);

    const existeNombre = await this.loteRepository.findOne({
      where: { nombre_lote: createLoteDto.nombre_lote },
    });
    if (existeNombre) {
      throw new BadRequestException('Ya existe un lote con este nombre');
    }

    const nuevo = this.loteRepository.create({
      ...createLoteDto,
      area_lote: areaCalculada,
    });

    try {
      const loteGuardado = await this.loteRepository.save(nuevo);
      return loteGuardado; // Retornamos el Lote completo
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<Lote[]> {
    return await this.loteRepository.find({ relations: ['sublotes'] });
  }

  async findOne(id_lote_pk: number): Promise<Lote> {
    const lote = await this.loteRepository.findOne({
      where: { id_lote_pk },
      relations: ['sublotes'],
    });
    if (!lote) throw new NotFoundException('Lote no encontrado');
    return lote;
  }

  async update(id_lote_pk: number, updateLoteDto: UpdateLoteDto): Promise<Lote> {
    const existente = await this.findOne(id_lote_pk);

    if (updateLoteDto.nombre_lote !== undefined) {
      existente.nombre_lote = updateLoteDto.nombre_lote;
    }

    if (updateLoteDto.coordenadas_lote !== undefined) {
      existente.coordenadas_lote = updateLoteDto.coordenadas_lote;
      existente.area_lote = this.calcularArea(updateLoteDto.coordenadas_lote);
    }

    if (updateLoteDto.area_lote !== undefined) {
      existente.area_lote = updateLoteDto.area_lote;
    }

    try {
      const loteActualizado = await this.loteRepository.save(existente);
      return loteActualizado; // Retornamos el Lote completo
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id_lote_pk: number): Promise<{ id_lote_pk: number }> {
    const result = await this.loteRepository.softDelete(id_lote_pk);
    if (result.affected === 0) throw new NotFoundException('Lote no encontrado');
    return { id_lote_pk };
  }

  async restore(id_lote_pk: number): Promise<Lote> {
    await this.loteRepository.restore(id_lote_pk);
    const lote = await this.findOne(id_lote_pk);
    return lote;
  }
}
