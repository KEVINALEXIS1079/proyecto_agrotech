import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedores } from './entities/proveedore.entity';
import { CreateProveedoresDto } from './dto/create-proveedore.dto';
import { UpdateProveedoresDto } from './dto/update-proveedore.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedores)
    private readonly proveedorRepository: Repository<Proveedores>,
  ) {}

  // Crear proveedor
  async create(createDto: CreateProveedoresDto) {
    const { nombre_proveedor, direccion_proveedor, email_proveedor, telefono_proveedor } = createDto;

    // Validación manual básica por si no estás usando class-validator
    if (!nombre_proveedor || !direccion_proveedor || !email_proveedor || !telefono_proveedor) {
      throw new BadRequestException('Todos los campos son obligatorios.');
    }

    const proveedor = this.proveedorRepository.create({
      nombre_proveedor,
      direccion: direccion_proveedor,
      email: email_proveedor,
      telefono: telefono_proveedor,
    });

    return await this.proveedorRepository.save(proveedor);
  }

  // Listar todos los proveedores
  async findAll() {
    return await this.proveedorRepository.find();
  }

  // Buscar proveedor por ID
  async findOne(id: number) {
    const proveedor = await this.proveedorRepository.findOneBy({ id_proveedor_pk: id });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    }
    return proveedor;
  }

  // Actualizar proveedor
  async update(id: number, updateDto: UpdateProveedoresDto) {
    const proveedor = await this.findOne(id); // Verifica existencia
    const actualizado = this.proveedorRepository.merge(proveedor, {
      nombre_proveedor: updateDto.nombre_proveedor ?? proveedor.nombre_proveedor,
      direccion: updateDto.direccion_proveedor ?? proveedor.direccion,
      email: updateDto.email_proveedor ?? proveedor.email,
      telefono: updateDto.telefono_proveedor ?? proveedor.telefono,
    });
    return await this.proveedorRepository.save(actualizado);
  }

  // Eliminar proveedor (soft delete)
  async remove(id: number) {
    await this.findOne(id); // Verifica existencia
    await this.proveedorRepository.softDelete(id);
    return { message: `Proveedor con ID ${id} eliminado correctamente` };
  }
}