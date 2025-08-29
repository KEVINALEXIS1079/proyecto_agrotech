import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidencia } from './entities/evidencia.entity';
import { CreateEvidenciaDto } from './dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from './dto/update-evidencia.dto';

@Injectable()
export class EvidenciasService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly evidenciaRepository: Repository<Evidencia>,
  ) {}

  //  Crear evidencia con imagen opcional
  async create(
    createEvidenciaDto: CreateEvidenciaDto,
    rutaImagen?: string,
  ): Promise<string> {
    const evidencia = this.evidenciaRepository.create({
      ...createEvidenciaDto,
      ruta_imagen: rutaImagen ?? null, // si no hay imagen, queda NULL
    });
    await this.evidenciaRepository.save(evidencia);
    return 'Evidencia registrada correctamente';
  }

  async findAll(): Promise<Evidencia[]> {
    return await this.evidenciaRepository.find({
      withDeleted: true,
    });
  }

  async findOne(id_evidencia_pk: number): Promise<Evidencia> {
    const evidencia = await this.evidenciaRepository.findOne({
      where: { id_evidencia_pk },
      withDeleted: true,
    });

    if (!evidencia) throw new NotFoundException('Evidencia no encontrada');
    return evidencia;
  }

  // Actualizar con opción de cambiar imagen
  async update(
    id_evidencia_pk: number,
    updateDto: UpdateEvidenciaDto,
    rutaImagen?: string,
  ): Promise<string> {
    const evidencia = await this.findOne(id_evidencia_pk);
    this.evidenciaRepository.merge(evidencia, updateDto);

    if (rutaImagen) {
      evidencia.ruta_imagen = rutaImagen; // reemplaza solo si hay nueva imagen
    }

    await this.evidenciaRepository.save(evidencia);
    return `Evidencia con ID ${id_evidencia_pk} actualizada correctamente`;
  }

  async remove(id_evidencia_pk: number): Promise<string> {
    const result = await this.evidenciaRepository.softDelete({ id_evidencia_pk });
    if (result.affected === 0) throw new NotFoundException('Evidencia no encontrada');
    return `Evidencia con ID ${id_evidencia_pk} eliminada correctamente`;
  }

  async restore(id_evidencia_pk: number): Promise<string> {
    const result = await this.evidenciaRepository.restore({ id_evidencia_pk });
    if (result.affected === 0) throw new NotFoundException('Evidencia no encontrada');
    return `Evidencia con ID ${id_evidencia_pk} restaurada correctamente`;
  }
}
