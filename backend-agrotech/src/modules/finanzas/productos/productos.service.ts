import { Injectable} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const producto = this.productoRepository.create(createProductoDto);
    return await this.productoRepository.save(producto);
  }

  async findAll() {
    return await this.productoRepository.find();
  }

  async findOne(id_producto_pk: number) {
    return await this.productoRepository.findOneBy({ id_producto_pk });
  }

  async update(id_producto_pk: number, updateProductoDto: UpdateProductoDto) {
    return await this.productoRepository.update(id_producto_pk, updateProductoDto);
  }

  async remove(id_producto_pk: number) {
    return await this.productoRepository.softDelete({ id_producto_pk }); //se le pasa el id
    // return await this.cultivoRepository.softRemove({Producto})  // se le pasa la instancia
  }

  async restore(id_producto_pk: number) {
    return await this.productoRepository.restore({ id_producto_pk });
  }
}
