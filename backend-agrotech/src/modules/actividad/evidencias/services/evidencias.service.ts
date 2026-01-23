import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidencia } from '../entities/evidencia.entity';
import { CreateEvidenciaDto } from '../dto/create-evidencia.dto';
import { UpdateEvidenciaDto } from '../dto/update-evidencia.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EvidenciasService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly evidenciaRepository: Repository<Evidencia>,
  ) {}

  async create(
    dto: CreateEvidenciaDto,
    imgPath?: string,
    username?: string,
  ): Promise<string> {
    let finalPath = imgPath;

    if (imgPath && username) {
      finalPath = await this.moveImageToUserFolder(imgPath, username);
    }

    const evidencia = this.evidenciaRepository.create({
      ...dto,
      img_evidencia: finalPath ?? null,
    });

    await this.evidenciaRepository.save(evidencia);
    return 'Evidencia registrada correctamente';
  }

  async findAll(): Promise<Evidencia[]> {
    return await this.evidenciaRepository.find({ withDeleted: true });
  }

  async findOne(id: number): Promise<Evidencia> {
    const evidencia = await this.evidenciaRepository.findOne({
      where: { id_evidencia_pk: id },
      withDeleted: true,
    });
    if (!evidencia) throw new NotFoundException('Evidencia no encontrada');
    return evidencia;
  }

  async update(
    id: number,
    dto: UpdateEvidenciaDto,
    imgPath?: string,
    username?: string,
  ): Promise<string> {
    const evidencia = await this.findOne(id);

    if (imgPath && username) {
      if (evidencia.img_evidencia) {
        await this.deleteImageFile(evidencia.img_evidencia);
      }
      evidencia.img_evidencia = await this.moveImageToUserFolder(imgPath, username);
    }

    this.evidenciaRepository.merge(evidencia, dto);
    await this.evidenciaRepository.save(evidencia);
    return `Evidencia con ID ${id} actualizada correctamente`;
  }

  async remove(id: number): Promise<string> {
    const evidencia = await this.findOne(id);

    if (evidencia.img_evidencia) {
      await this.deleteImageFile(evidencia.img_evidencia);
    }

    const result = await this.evidenciaRepository.softDelete({ id_evidencia_pk: id });
    if (result.affected === 0) throw new NotFoundException('Evidencia no encontrada');
    return `Evidencia con ID ${id} eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.evidenciaRepository.restore({ id_evidencia_pk: id });
    if (result.affected === 0) throw new NotFoundException('Evidencia no encontrada');
    return `Evidencia con ID ${id} restaurada correctamente`;
  }

  private async moveImageToUserFolder(originalPath: string, username: string): Promise<string> {
    const userFolder = path.join('./uploads/evidencias', username);
    const fileName = path.basename(originalPath);
    const newPath = path.join(userFolder, fileName);

    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    if (fs.existsSync(originalPath)) {
      fs.renameSync(originalPath, newPath);
      return newPath;
    }

    return originalPath;
  }

  private async deleteImageFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
