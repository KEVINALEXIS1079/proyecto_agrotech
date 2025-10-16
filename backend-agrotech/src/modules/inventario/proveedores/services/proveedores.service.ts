import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../entities/proveedores.entity';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  // Crear proveedor
  async create (dto: CreateProveedorDto): Promise<string>{

    const existeNombre= await this.proveedorRepository.findOne({
      where: { nombre_proveedor:dto.nombre_proveedor},
    });
    if (existeNombre) {
      throw new BadGatewayException(
        `El proveedor ya existe`,
      );
    }

    const existeDireccion= await this.proveedorRepository.findOne({
      where: { direccion_proveedor: dto.direccion_proveedor},
    });
    if (existeDireccion) {
      throw new BadRequestException(
        `La direccion del proveedor ya existe`
      );
    }

    const existeCorreo= await this.proveedorRepository.findOne({
      where: { email_proveedor: dto.email_proveedor},
    });
    if (existeCorreo) {
      throw new BadGatewayException(
        `El correo del proveedor ya esta registrado`
      );
    }
    const existeTelfono= await this.proveedorRepository.findOne({
      where: { telefono_proveedor: dto.telefono_proveedor},
    });
    if (existeTelfono) {
      throw new BadGatewayException(
        `El telefono del proveedor ya existe`
      );
    }

    const proveedor = this.proveedorRepository.create(dto);
    await this.proveedorRepository.save(proveedor);
    return 'Proveedor creado correctamente'
  }

  // Listar todos
  async findAll(): Promise<Proveedor[]> {
    return await this.proveedorRepository.find({
      withDeleted: true, // Incluye eliminados
    });
  }

  // Buscar por ID
  async findOne(id_proveedor_pk: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id_proveedor_pk },
      withDeleted: true,
    });
    if (!proveedor) throw new Error('Proveedor no encontrado');
    return proveedor;
  }

  // Actualizar
  async update(id_proveedor_pk: number, dto: UpdateProveedorDto): Promise<string> {
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
