import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async create(dto: CreateCategoriaDto): Promise<string> {
    const nueva = this.categoriaRepository.create(dto);
    await this.categoriaRepository.save(nueva);
    return 'Categoría registrada correctamente';
  }

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find();
  }

  async findOne(id_categoria_pk: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id_categoria_pk },
      withDeleted: true,
    });
    if (!categoria) throw new Error('Categoría no encontrada');
    return categoria;
  }

  async update(id_categoria_pk: number, dto: UpdateCategoriaDto): Promise<string> {
    const categoria = await this.categoriaRepository.findOneBy({ id_categoria_pk });
    if (!categoria) throw new Error('Categoría no encontrada');

    Object.assign(categoria, dto);
    await this.categoriaRepository.save(categoria);
    return 'Categoría actualizada correctamente';
  }

  async remove(id_categoria_pk: number): Promise<string> {
    const result = await this.categoriaRepository.softDelete(id_categoria_pk);
    if (result.affected === 0) throw new Error('Categoría no encontrada');
    return 'Categoría eliminada correctamente';
  }

  async restore(id_categoria_pk: number): Promise<string> {
    const result = await this.categoriaRepository.restore(id_categoria_pk);
    if (result.affected === 0) throw new Error('Categoría no encontrada');
    return 'Categoría restaurada correctamente';
  }
}