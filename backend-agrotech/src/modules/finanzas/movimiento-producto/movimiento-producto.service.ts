import { Injectable} from '@nestjs/common';
import { CreateMovimientoProductoDto } from './dto/create-movimiento-producto.dto';
import { UpdateMovimientoProductoDto } from './dto/update-movimiento-producto.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MovimientoProducto } from './entities/movimiento-producto.entity';

@Injectable()
export class MovimientoProductoService {
  constructor(
    @InjectRepository(MovimientoProducto)
    private readonly movimientoProductoRepository: Repository<MovimientoProducto>,
  ) {}

  async create(createMovimientoProductoDto: CreateMovimientoProductoDto) {
    const movimientoProducto = this.movimientoProductoRepository.create(createMovimientoProductoDto);
    return await this.movimientoProductoRepository.save(movimientoProducto);
  }

  async findAll() {
    return await this.movimientoProductoRepository.find();
  }

  async findOne(id_movimiento_producto_pk: number) {
    return await this.movimientoProductoRepository.findOneBy({ id_movimiento_producto_pk });
  }

  async update(id_movimiento_producto_pk: number, updateMovimientoProductoDto: UpdateMovimientoProductoDto) {
    return await this.movimientoProductoRepository.update(id_movimiento_producto_pk, updateMovimientoProductoDto);
  }

  async remove(id_movimiento_producto_pk: number) {
    return await this.movimientoProductoRepository.softDelete({ id_movimiento_producto_pk }); //se le pasa el id
    // return await this.cultivoRepository.softRemove({MovimientoProducto})  // se le pasa la instancia
  }

  async restore(id_movimiento_producto_pk: number) {
    return await this.movimientoProductoRepository.restore({ id_movimiento_producto_pk });
  }
}
