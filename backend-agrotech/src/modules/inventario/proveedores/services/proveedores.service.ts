// src/modules/inventario/proveedores/services/proveedores.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Proveedor } from '../entities/proveedores.entity';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';

function norm(s?: string | null) {
  if (s == null) return s as any;
  return s.trim().replace(/\s+/g, ' ');
}
function normEmail(s?: string | null) {
  if (!s) return s;
  return norm(s).toLowerCase();
}

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly repo: Repository<Proveedor>,
  ) {}

  async create(dto: CreateProveedorDto) {
    const nombre = norm(dto.nombre_proveedor);
    const direccion = norm(dto.direccion_proveedor);
    const email = normEmail(dto.email_proveedor);
    const telefono = norm(dto.telefono_proveedor ?? null);

    // Duplicados (incluye soft-deleted para evitar “re-crear”)
    const dupNombre = await this.repo.findOne({
      where: { nombre_proveedor: ILike(nombre) },
      withDeleted: true,
    });
    if (dupNombre) throw new ConflictException('El proveedor ya existe (nombre)');

    if (email) {
      const dupEmail = await this.repo.findOne({
        where: { email_proveedor: ILike(email) },
        withDeleted: true,
      });
      if (dupEmail) throw new ConflictException('El correo del proveedor ya está registrado');
    }

    if (telefono) {
      // Si quieres estrictamente único en teléfono, descomenta:
      // const dupTel = await this.repo.findOne({ where: { telefono_proveedor: telefono }, withDeleted: true });
      // if (dupTel) throw new ConflictException('El teléfono del proveedor ya está registrado');
    }

    const nuevo = this.repo.create({
      nombre_proveedor: nombre,
      direccion_proveedor: direccion,
      email_proveedor: email ?? null,
      telefono_proveedor: telefono ?? null,
    });

    const saved = await this.repo.save(nuevo);
    return { message: 'Proveedor creado correctamente', data: saved };
  }

  async findAll(): Promise<Proveedor[]> {
    // Por defecto solo activos (sin withDeleted). Si quieres incluir borrados, agrega un endpoint aparte.
    return this.repo.find();
  }

  async findOne(id: number): Promise<Proveedor> {
    const prov = await this.repo.findOne({ where: { id_proveedor_pk: id }, withDeleted: true });
    if (!prov) throw new NotFoundException('Proveedor no encontrado');
    return prov;
  }

  async update(id: number, dto: UpdateProveedorDto) {
    const prov = await this.repo.findOne({ where: { id_proveedor_pk: id }, withDeleted: true });
    if (!prov) throw new NotFoundException('Proveedor no encontrado');

    if (dto.nombre_proveedor) {
      const nombre = norm(dto.nombre_proveedor);
      const dup = await this.repo.findOne({
        where: { nombre_proveedor: ILike(nombre) },
        withDeleted: true,
      });
      if (dup && dup.id_proveedor_pk !== id) {
        throw new ConflictException('Ya existe un proveedor con ese nombre');
      }
      prov.nombre_proveedor = nombre;
    }

    if (dto.direccion_proveedor !== undefined) {
      prov.direccion_proveedor = norm(dto.direccion_proveedor);
    }

    if (dto.email_proveedor !== undefined) {
      const email = normEmail(dto.email_proveedor);
      if (email) {
        const dup = await this.repo.findOne({
          where: { email_proveedor: ILike(email) },
          withDeleted: true,
        });
        if (dup && dup.id_proveedor_pk !== id) {
          throw new ConflictException('Ya existe un proveedor con ese correo');
        }
      }
      prov.email_proveedor = email ?? null;
    }

    if (dto.telefono_proveedor !== undefined) {
      prov.telefono_proveedor = norm(dto.telefono_proveedor);
      // Si decides teléfono único, valida aquí como en create
    }

    const saved = await this.repo.save(prov);
    return { message: 'Proveedor actualizado correctamente', data: saved };
  }

  async remove(id: number) {
    const res = await this.repo.softDelete(id);
    if (res.affected === 0) throw new NotFoundException('Proveedor no encontrado');
    return { message: 'Proveedor eliminado correctamente' };
  }

  async restore(id: number) {
    const res = await this.repo.restore(id);
    if (res.affected === 0) throw new NotFoundException('Proveedor no encontrado');
    const restored = await this.findOne(id);
    return { message: 'Proveedor restaurado correctamente', data: restored };
  }
}
