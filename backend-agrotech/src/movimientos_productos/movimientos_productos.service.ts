import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientosProductos } from './entities/movimientos_producto.entity';
import { CreateMovimientosProductosDto } from './dto/create-movimientos_producto.dto';
import { UpdateMovimientosProductosDto } from './dto/update-movimientos_producto.dto';

@Injectable()
export class MovimientosProductosService {
  constructor(
    @InjectRepository(MovimientosProductos)
    private repo: Repository<MovimientosProductos>,
  ) {}

  async create(dto: CreateMovimientosProductosDto) {
    try {
      const nuevo = this.repo.create({
        ...dto,
        producto: { id_producto_pk: dto.id_producto_fk } 
      });

      await this.repo.save(nuevo);
      return { message: 'Movimiento registrado con éxito' };
    } catch (error) {
      return { message: 'No se pudo registrar el movimiento', error: error.message };
    }
  }

  async findAll() {
    return await this.repo.find({ relations: ['producto'] });
  }

  async findOne(id: number) {
    const movimiento = await this.repo.findOne({
      where: { id_movimiento_producto_pk: id },
      relations: ['producto'],
    });
    if (!movimiento) {
      return { message: 'Movimiento no encontrado' };
    }
    return movimiento;
  }

  async update(id: number, dto: UpdateMovimientosProductosDto) {
    const movimiento = await this.repo.findOneBy({ id_movimiento_producto_pk: id });
    if (!movimiento) return { message: 'Movimiento no encontrado' };

    try {
      if (dto.id_producto_fk) {
        await this.repo.update(id, {
          ...dto,
          producto: { id_producto_pk: dto.id_producto_fk } 
        });
      } else {
        await this.repo.update(id, dto);
      }
      return { message: 'Movimiento actualizado con éxito' };
    } catch (error) {
      return { message: 'No se pudo actualizar el movimiento', error: error.message };
    }
  }

  async remove(id: number) {
    const movimiento = await this.repo.findOneBy({ id_movimiento_producto_pk: id });
    if (!movimiento) return { message: 'Movimiento no encontrado' };

    await this.repo.softDelete(id);
    return { message: 'Movimiento eliminado (soft delete)' };
  }

  async restore(id: number) {
    const resultado = await this.repo.restore(id);
    if (resultado.affected === 0) return { message: 'No se encontró el movimiento para restaurar' };
    return { message: 'Movimiento restaurado correctamente' };
  }
}