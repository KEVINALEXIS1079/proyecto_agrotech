import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,
  ) {}

  // Crear producto
  async create(createProductoDto: CreateProductoDto): Promise<string> {
    const { id_cultivo_fk, ...data } = createProductoDto;

    // Validar que exista el cultivo
    const cultivo = await this.cultivoRepo.findOne({
      where: { id_cultivo_pk: id_cultivo_fk },
    });
    if (!cultivo) throw new NotFoundException('Cultivo no encontrado');

    // Crear el producto con la relación al cultivo
    const nuevo = this.productoRepo.create({
      ...data,
      cultivo,
    });

    await this.productoRepo.save(nuevo);
    return 'Producto registrado correctamente';
  }

  // Listar todos
  async findAll(): Promise<Producto[]> {
    return await this.productoRepo.find({
      relations: ['cultivo'], // Incluye la relación si quieres ver el cultivo
    });
  }

  // Buscar uno
  async findOne(id_producto_pk: number): Promise<Producto> {
    const producto = await this.productoRepo.findOne({
      where: { id_producto_pk },
      relations: ['cultivo'],
      withDeleted: true,
    });

    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  // Actualizar
  async update(id_producto_pk: number, dto: UpdateProductoDto): Promise<string> {
    const producto = await this.productoRepo.findOneBy({ id_producto_pk });
    if (!producto) throw new NotFoundException('Producto no encontrado');

    // Si viene un nuevo cultivo, validar que exista
    let cultivo: Cultivo | null = null;
    if (dto.id_cultivo_fk !== undefined) {
      cultivo = await this.cultivoRepo.findOne({
        where: { id_cultivo_pk: dto.id_cultivo_fk },
      });
      if (!cultivo) throw new NotFoundException('Cultivo no encontrado');
    }

    // Solo asignar lo que no sea null
    Object.assign(producto, {
      ...dto,
      ...(cultivo ? { cultivo } : {}),
    });

    await this.productoRepo.save(producto);
    return 'Producto actualizado correctamente';
  }

  // Eliminar (soft delete)
  async remove(id_producto_pk: number): Promise<string> {
    const result = await this.productoRepo.softDelete({ id_producto_pk });
    if (result.affected === 0) throw new NotFoundException('Producto no encontrado');
    return 'Producto eliminado correctamente';
  }

  // Restaurar
  async restore(id_producto_pk: number): Promise<string> {
    const result = await this.productoRepo.restore({ id_producto_pk });
    if (result.affected === 0) throw new NotFoundException('Producto no encontrado');
    return 'Producto restaurado correctamente';
  }
}
