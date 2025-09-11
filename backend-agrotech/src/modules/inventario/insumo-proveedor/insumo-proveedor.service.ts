import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsumoProveedor } from './entities/insumo-proveedor.entity';
import { CreateInsumoProveedorDto } from './dto/create-insumo-proveedor.dto';
import { UpdateInsumoProveedorDto } from './dto/update-insumo-proveedor.dto';
import { Insumo } from '../insumos/entities/insumo.entity';
import { Proveedor } from '../proveedores/entities/proveedores.entity';

@Injectable()
export class InsumoProveedorService {
  constructor(
    @InjectRepository(InsumoProveedor)
    private readonly insumoProveedorRepository: Repository<InsumoProveedor>,

    @InjectRepository(Insumo)
    private readonly insumoRepository: Repository<Insumo>,

    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  async create(dto: CreateInsumoProveedorDto): Promise<string> {
    const insumo = await this.insumoRepository.findOneBy({ id_insumo_pk: dto.id_insumo_fk });
    if (!insumo) throw new NotFoundException('El insumo especificado no existe');

    const proveedor = await this.proveedorRepository.findOneBy({ id_proveedor_pk: dto.id_proveedor_fk });
    if (!proveedor) throw new NotFoundException('El proveedor especificado no existe');

    // Validar si ya existe esa relación insumo-proveedor
    const existe = await this.insumoProveedorRepository.findOne({
      where: {
        insumo: { id_insumo_pk: dto.id_insumo_fk },
        proveedor: { id_proveedor_pk: dto.id_proveedor_fk },
      },
      relations: ['insumo', 'proveedor'],
    });

    if (existe) {
      throw new BadRequestException(
        `La relación entre el insumo ID ${dto.id_insumo_fk} y el proveedor ID ${dto.id_proveedor_fk} ya existe`,
      );
    }

    const nuevo = this.insumoProveedorRepository.create({ insumo, proveedor });
    await this.insumoProveedorRepository.save(nuevo);

    return 'Relación Insumo-Proveedor registrada correctamente';
  }

  async findAll(): Promise<InsumoProveedor[]> {
    const registros = await this.insumoProveedorRepository.find({
      relations: ['insumo', 'proveedor'],
      withDeleted: true,
    });

    if (!registros || registros.length === 0) {
      throw new NotFoundException('No se encontraron relaciones Insumo-Proveedor registradas');
    }
    return registros;
  }

  async findOne(id: number): Promise<InsumoProveedor> {
    const registro = await this.insumoProveedorRepository.findOne({
      where: { id_insumo_proveedor_pk: id },
      relations: ['insumo', 'proveedor'],
      withDeleted: true,
    });

    if (!registro) {
      throw new NotFoundException(`Insumo-Proveedor con ID ${id} no encontrado`);
    }
    return registro;
  }

  async update(id: number, dto: UpdateInsumoProveedorDto): Promise<string> {
    const existente = await this.findOne(id);

    if (dto.id_insumo_fk) {
      const insumo = await this.insumoRepository.findOneBy({ id_insumo_pk: dto.id_insumo_fk });
      if (!insumo) throw new NotFoundException('El insumo especificado no existe');
      existente.insumo = insumo;
    }

    if (dto.id_proveedor_fk) {
      const proveedor = await this.proveedorRepository.findOneBy({ id_proveedor_pk: dto.id_proveedor_fk });
      if (!proveedor) throw new NotFoundException('El proveedor especificado no existe');
      existente.proveedor = proveedor;
    }

    await this.insumoProveedorRepository.save(existente);
    return `Relación Insumo-Proveedor con ID ${id} actualizada correctamente`;
  }

  async remove(id: number): Promise<string> {
    const result = await this.insumoProveedorRepository.softDelete({ id_insumo_proveedor_pk: id });
    if (result.affected === 0) {
      throw new NotFoundException(`Insumo-Proveedor con ID ${id} no encontrado`);
    }
    return `Insumo-Proveedor con ID ${id} eliminado correctamente`;
  }

  async restore(id: number): Promise<string> {
    const result = await this.insumoProveedorRepository.restore({ id_insumo_proveedor_pk: id });
    if (result.affected === 0) {
      throw new NotFoundException(`Insumo-Proveedor con ID ${id} no encontrado`);
    }
    return `Insumo-Proveedor con ID ${id} restaurado correctamente`;
  }
}
