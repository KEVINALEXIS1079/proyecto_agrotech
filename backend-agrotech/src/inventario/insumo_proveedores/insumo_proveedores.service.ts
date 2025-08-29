import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsumosProveedores } from './entities/insumo_proveedores.entity';
import { CreateInsumosProveedoresDto } from './dto/create-insumo_proveedor.dto';
import { UpdateInsumosProveedoresDto } from './dto/update-insumo_proveedor.dto';

@Injectable()
export class InsumosProveedoresService {
  constructor(
    @InjectRepository(InsumosProveedores)
    private readonly insumosProveedoresRepository: Repository<InsumosProveedores>,
  ) {}

  async create(dto: CreateInsumosProveedoresDto): Promise<string> {
    const nuevo = this.insumosProveedoresRepository.create({
      insumo: { id_insumo_pk: dto.id_insumo_fk } as any,
      proveedor: { id_proveedor_pk: dto.id_proveedor_fk } as any,
    });
    await this.insumosProveedoresRepository.save(nuevo);
    return ' Insumo Proveedor registrado correctamente';
  }

  async findAll(): Promise<InsumosProveedores[]> {
    return await this.insumosProveedoresRepository.find({
      relations: ['insumo', 'proveedor'],
    });
  }

  async findOne(id_insumo_proveedor_pk: number): Promise<InsumosProveedores> {
    const registro = await this.insumosProveedoresRepository.findOne({
      where: { id_insumo_proveedor_pk },
      relations: ['insumo', 'proveedor'],
      withDeleted: true,
    });
    if (!registro) throw new Error(' Insumo Proveedor no encontrado');
    return registro;
  }

  async update(
    id_insumo_proveedor_pk: number,
    dto: UpdateInsumosProveedoresDto,
  ): Promise<string> {
    const existente = await this.insumosProveedoresRepository.findOneBy({
      id_insumo_proveedor_pk,
    });
    if (!existente) throw new Error(' Insumo Proveedor no encontrado');

    if (dto.id_insumo_fk) {
      existente.insumo = { id_insumo_pk: dto.id_insumo_fk } as any;
    }
    if (dto.id_proveedor_fk) {
      existente.proveedor = { id_proveedor_pk: dto.id_proveedor_fk } as any;
    }

    await this.insumosProveedoresRepository.save(existente);
    return ' Insumo Proveedor actualizado correctamente';
  }

  async remove(id_insumo_proveedor_pk: number): Promise<string> {
    const result = await this.insumosProveedoresRepository.softDelete({
      id_insumo_proveedor_pk,
    });
    if (result.affected === 0)
      throw new Error(' Insumo Proveedor no encontrado');
    return ' Insumo Proveedor eliminado correctamente';
  }

  async restore(id_insumo_proveedor_pk: number): Promise<string> {
    const result = await this.insumosProveedoresRepository.restore({
      id_insumo_proveedor_pk,
    });
    if (result.affected === 0)
      throw new Error(' Insumo Proveedor no encontrado');
    return ' Insumo Proveedor restaurado correctamente';
  }
}
