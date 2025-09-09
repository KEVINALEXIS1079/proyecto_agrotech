import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsumoProveedor } from './entities/insumo-proveedor.entity';
import { CreateInsumoProveedorDto } from './dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from './dto/update-insumo-proveedor.dto';

@Injectable()
export class InsumoProveedorService {
  constructor(
    @InjectRepository(InsumoProveedor)
    private readonly insumosProveedoresRepository: Repository<InsumoProveedor>,
  ) {}

  async create(dto: CreateInsumoProveedorDto): Promise<string> {
    const nuevo = this.insumosProveedoresRepository.create({
      insumo: { id_insumo_pk: dto.id_insumo_fk } as any,
      proveedor: { id_proveedor_pk: dto.id_proveedor_fk } as any,
    });
    await this.insumosProveedoresRepository.save(nuevo);
    return ' Insumo Proveedor registrado correctamente';
  }

  async findAll(): Promise<InsumoProveedor[]> {
    return await this.insumosProveedoresRepository.find({
      relations: ['insumo', 'proveedor'],
    });
  }

  async findOne(id_insumo_proveedor_pk: number): Promise<InsumoProveedor> {
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
    dto: UpdateInsumoProveedorDto,
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
