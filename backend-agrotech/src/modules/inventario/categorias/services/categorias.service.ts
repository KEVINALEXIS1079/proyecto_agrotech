// src/modules/inventario/categorias/services/categorias.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

function normalize(s: string) {
  return s.trim().replace(/\s+/g, ' ');
}

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto) {
    const nombre = normalize(dto.nombre_categoria);
    const descripcion = normalize(dto.descripcion_categoria);

    // Único por nombre (case-insensitive, incluye soft-deleted)
    const dup = await this.categoriaRepository.findOne({
      where: { nombre_categoria: ILike(nombre) },
      withDeleted: true,
    });
    if (dup) throw new ConflictException('Ya existe una categoría con ese nombre');

    const nueva = this.categoriaRepository.create({
      nombre_categoria: nombre,
      descripcion_categoria: descripcion,
    });
    const saved = await this.categoriaRepository.save(nueva);
    return { message: 'Categoría registrada correctamente', data: saved };
  }

  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async findOne(id_categoria_pk: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id_categoria_pk },
      withDeleted: true,
    });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
  }

  async update(id_categoria_pk: number, dto: UpdateCategoriaDto) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id_categoria_pk },
      withDeleted: true,
    });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    if (dto.nombre_categoria) {
      const nombre = normalize(dto.nombre_categoria);
      const dup = await this.categoriaRepository.findOne({
        where: { nombre_categoria: ILike(nombre) },
        withDeleted: true,
      });
      if (dup && dup.id_categoria_pk !== id_categoria_pk) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
      categoria.nombre_categoria = nombre;
    }

    if (dto.descripcion_categoria != null) {
      categoria.descripcion_categoria = normalize(dto.descripcion_categoria);
    }

    const saved = await this.categoriaRepository.save(categoria);
    return { message: 'Categoría actualizada correctamente', data: saved };
  }

  async remove(id_categoria_pk: number) {
    const res = await this.categoriaRepository.softDelete(id_categoria_pk);
    if (res.affected === 0) throw new NotFoundException('Categoría no encontrada');
    return { message: 'Categoría eliminada correctamente' };
  }

  async restore(id_categoria_pk: number) {
    const res = await this.categoriaRepository.restore(id_categoria_pk);
    if (res.affected === 0) throw new NotFoundException('Categoría no encontrada');
    const restored = await this.findOne(id_categoria_pk);
    return { message: 'Categoría restaurada correctamente', data: restored };
  }
}
