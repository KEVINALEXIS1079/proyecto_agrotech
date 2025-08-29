import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedores } from './entities/proveedores.entity';
import { CreateProveedoresDto } from './dto/create-proveedores.dto';
import { UpdateProveedoresDto } from './dto/update-proveedores.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedores)
    private readonly proveedorRepository: Repository<Proveedores>,
  ) {}

  // Crear proveedor
  async create(dto: CreateProveedoresDto): Promise<string> {
    const nuevoProveedor = this.proveedorRepository.create(dto);
    await this.proveedorRepository.save(nuevoProveedor);
    return 'Proveedor registrado correctamente';
  }

  // Listar todos
  async findAll(): Promise<Proveedores[]> {
    return await this.proveedorRepository.find({
      withDeleted: true, // Incluye eliminados
    });
  }

  // Buscar por ID
  async findOne(id_proveedor_pk: number): Promise<Proveedores> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id_proveedor_pk },
      withDeleted: true,
    });
    if (!proveedor) throw new Error('Proveedor no encontrado');
    return proveedor;
  }

  // Actualizar
  async update(id_proveedor_pk: number, dto: UpdateProveedoresDto): Promise<string> {
    const proveedor = await this.proveedorRepository.findOneBy({ id_proveedor_pk });
    if (!proveedor) throw new Error('Proveedor no encontrado');

    Object.assign(proveedor, dto);
    await this.proveedorRepository.save(proveedor);
    return 'Proveedor actualizado correctamente';
  }

  // Eliminar (soft delete)
  async remove(id_proveedor_pk: number): Promise<string> {
    const result = await this.proveedorRepository.softDelete(id_proveedor_pk);
    if (result.affected === 0) throw new Error('Proveedor no encontrado');
    return 'Proveedor eliminado correctamente';
  }

  // Restaurar
  async restore(id_proveedor_pk: number): Promise<string> {
    const result = await this.proveedorRepository.restore(id_proveedor_pk);
    if (result.affected === 0) throw new Error('Proveedor no encontrado');
    return 'Proveedor restaurado correctamente';
  }
}
