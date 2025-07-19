import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    try {
      const nuevo = this.productoRepository.create(createProductoDto);
      await this.productoRepository.save(nuevo);
      return { message: 'Producto registrado con éxito' };
    } catch (error) {
      return { message: 'No se pudo registrar el producto', error: error.message };
    }
  }

  async findAll() {
    return await this.productoRepository.find();
  }

  async findOne(id: number) {
    return await this.productoRepository.findOneBy({ id_producto_pk: id });
  }

  async update(id: number, updateDto: UpdateProductoDto) {
    try {
      await this.productoRepository.update(id, updateDto);
      return { message: 'Producto actualizado con éxito' };
    } catch (error) {
      return { message: 'No se pudo actualizar el producto', error: error.message };
    }
  }

  async remove(id: number) {
    try {
      await this.productoRepository.softDelete(id);
      return { message: 'Producto eliminado (soft delete) con éxito' };
    } catch (error) {
      return { message: 'No se pudo eliminar el producto', error: error.message };
    }
  }

  async restore(id: number) {
    try {
      await this.productoRepository.restore(id);
      return { message: 'Producto restaurado con éxito' };
    } catch (error) {
      return { message: 'No se pudo restaurar el producto', error: error.message };
    }
  }
}