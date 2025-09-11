import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoProducto } from './entities/movimiento-producto.entity';
import { CreateMovimientoProductoDto } from './dto/create-movimiento-producto.dto';
import { UpdateMovimientoProductoDto } from './dto/update-movimiento-producto.dto';

@Injectable()
export class MovimientoProductoService {
  constructor(
    @InjectRepository(MovimientoProducto)
    private readonly movimientoProductoRepository: Repository<MovimientoProducto>,
  ) {}

  async create(createDto: CreateMovimientoProductoDto): Promise<string> {
    // Validar si ya existe un movimiento con mismo producto y fecha
    const existe = await this.movimientoProductoRepository.findOne({
      where: { tipo_movimiento: createDto.tipo_movimiento }, // Ajusta según tu propiedad única
    });
    if (existe) {
      throw new BadRequestException(`El movimiento del producto ya existe`);
    }

    const movimiento = this.movimientoProductoRepository.create(createDto);
    try {
      await this.movimientoProductoRepository.save(movimiento);
      return 'Movimiento de producto registrado correctamente';
    } catch (error: any) {
      throw new BadRequestException('Error al registrar movimiento de producto: ' + error.message);
    }
  }

  async findAll(): Promise<MovimientoProducto[]> {
    const items = await this.movimientoProductoRepository.find({ withDeleted: true });
    if (!items || items.length === 0) {
      throw new NotFoundException('No se encontraron movimientos de productos registrados');
    }
    return items;
  }

  async findOne(id: number): Promise<MovimientoProducto> {
    const item = await this.movimientoProductoRepository.findOne({
      where: { id_movimiento_producto_pk: id },
      withDeleted: true,
    });
    if (!item) throw new NotFoundException(`Movimiento de producto con ID ${id} no encontrado`);
    return item;
  }

  async update(id: number, dto: UpdateMovimientoProductoDto): Promise<string> {
    const item = await this.movimientoProductoRepository.findOneBy({ id_movimiento_producto_pk: id });
    if (!item) throw new NotFoundException(`Movimiento de producto con ID ${id} no encontrado`);

    Object.assign(item, dto);

    try {
      await this.movimientoProductoRepository.save(item);
      return `Movimiento de producto con ID ${id} actualizado correctamente`;
    } catch (error: any) {
      throw new BadRequestException('Error al actualizar movimiento de producto: ' + error.message);
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.movimientoProductoRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException(`Movimiento de producto con ID ${id} no encontrado`);
    return `Movimiento de producto con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.movimientoProductoRepository.restore(id);
    if (result.affected === 0) throw new NotFoundException(`Movimiento de producto con ID ${id} no encontrado`);
    return `Movimiento de producto con ID ${id} restaurado correctamente`;
  }
}
