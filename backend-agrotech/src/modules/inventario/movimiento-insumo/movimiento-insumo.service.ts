import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoInsumo } from './entities/movimiento-insumo.entity';
import { CreateMovimientoInsumoDto } from './dto/create-movimiento-insumo.dto';
import { UpdateMovimientoInsumoDto } from './dto/update-movimiento-insumo.dto';
import { Insumo } from 'src/modules/inventario/insumos/entities/insumo.entity';

@Injectable()
export class MovimientoInsumoService {
  constructor(
    @InjectRepository(MovimientoInsumo)
    private readonly movimientoRepo: Repository<MovimientoInsumo>,
    @InjectRepository(Insumo)
    private readonly insumoRepo: Repository<Insumo>,
  ) {}

  async create(dto: CreateMovimientoInsumoDto): Promise<any> {
    const insumo = await this.insumoRepo.findOne({ where: { id_insumo_pk: dto.id_insumo_fk } });
    if (!insumo) throw new NotFoundException('Insumo no encontrado');

    // actualizar stock
    let stock = insumo.stock ?? 0;

    if (dto.tipo_movimiento.toLowerCase() === 'entrada') {
      stock += dto.cantidad;
    } else if (dto.tipo_movimiento.toLowerCase() === 'salida') {
      stock -= dto.cantidad;
      if (stock < 0) stock = 0;
    } else {
      throw new BadRequestException('tipo_movimiento inválido');
    }

    // actualizar estado
    const stock_minimo = 10;
    let estado = 'A';
    if (stock <= stock_minimo) estado = 'B';
    else if (stock <= stock_minimo + 10) estado = 'M';

    insumo.stock = stock;
    insumo.estado_insumo = estado;
    await this.insumoRepo.save(insumo);

    const movimiento = this.movimientoRepo.create({
      ...dto,
      insumo,
    });

    await this.movimientoRepo.save(movimiento);

    return {
      message: 'Movimiento de insumo registrado y stock actualizado',
      nuevoStock: stock,
      estado_insumo: estado,
    };
  }

  async findAll(): Promise<MovimientoInsumo[]> {
    return this.movimientoRepo.find({ relations: ['insumo', 'actividad'] });
  }

  async findOne(id: number): Promise<MovimientoInsumo> {
    const movimiento = await this.movimientoRepo.findOne({
      where: { id_movimiento_insumo_pk: id },
      relations: ['insumo', 'actividad'],
      withDeleted: true,
    });
    if (!movimiento) throw new NotFoundException('Movimiento no encontrado');
    return movimiento;
  }

  async update(id: number, dto: UpdateMovimientoInsumoDto): Promise<string> {
    const movimiento = await this.movimientoRepo.findOneBy({ id_movimiento_insumo_pk: id });
    if (!movimiento) throw new NotFoundException('Movimiento no encontrado');

    Object.assign(movimiento, dto);
    await this.movimientoRepo.save(movimiento);
    return 'Movimiento de insumo actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.movimientoRepo.softDelete({ id_movimiento_insumo_pk: id });
    if (result.affected === 0) throw new NotFoundException('Movimiento no encontrado');
    return 'Movimiento de insumo eliminado correctamente';
  }

  async restore(id: number): Promise<string> {
    const result = await this.movimientoRepo.restore({ id_movimiento_insumo_pk: id });
    if (result.affected === 0) throw new NotFoundException('Movimiento no encontrado');
    return 'Movimiento de insumo restaurado correctamente';
  }
}
