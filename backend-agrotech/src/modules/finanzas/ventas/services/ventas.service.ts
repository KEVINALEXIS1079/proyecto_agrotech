import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  async create(createDto: CreateVentaDto): Promise<string> {
    // Aquí puedes agregar validaciones adicionales si lo deseas
    const venta = this.ventaRepository.create(createDto);
    try {
      await this.ventaRepository.save(venta);
      return 'Venta registrada correctamente';
    } catch (error: any) {
      throw new BadRequestException('Error al registrar la venta: ' + error.message);
    }
  }

  async findAll(): Promise<Venta[]> {
    const ventas = await this.ventaRepository.find({ withDeleted: true });
    if (!ventas || ventas.length === 0) {
      throw new NotFoundException('No se encontraron ventas registradas');
    }
    return ventas;
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id_venta_pk: id },
      withDeleted: true,
    });
    if (!venta) throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    return venta;
  }

  async update(id: number, dto: UpdateVentaDto): Promise<string> {
    const venta = await this.ventaRepository.findOneBy({ id_venta_pk: id });
    if (!venta) throw new NotFoundException(`Venta con ID ${id} no encontrada`);

    Object.assign(venta, dto);

    try {
      await this.ventaRepository.save(venta);
      return `Venta con ID ${id} actualizada correctamente`;
    } catch (error: any) {
      throw new BadRequestException('Error al actualizar la venta: ' + error.message);
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.ventaRepository.softDelete(id);
    if (result.affected === 0) throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    return `Venta con ID ${id} eliminada correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.ventaRepository.restore(id);
    if (result.affected === 0) throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    return `Venta con ID ${id} restaurada correctamente`;
  }
}
