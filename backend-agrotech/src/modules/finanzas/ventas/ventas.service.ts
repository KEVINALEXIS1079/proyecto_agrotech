import { Injectable} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    const venta = this.ventaRepository.create(createVentaDto);
    return await this.ventaRepository.save(venta);
  }

  async findAll() {
    return await this.ventaRepository.find();
  }

  async findOne(id_venta_pk: number) {
    return await this.ventaRepository.findOneBy({ id_venta_pk });
  }

  async update(id_venta_pk: number, updateVentaDto: UpdateVentaDto) {
    return await this.ventaRepository.update(id_venta_pk, updateVentaDto);
  }

  async remove(id_venta_pk: number) {
    return await this.ventaRepository.softDelete({ id_venta_pk }); //se le pasa el id
    // return await this.cultivoRepository.softRemove({Venta})  // se le pasa la instancia
  }

  async restore(id_venta_pk: number) {
    return await this.ventaRepository.restore({ id_venta_pk });
  }
}
