// src/modules/inventario/almacenes/services/almacenes.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Almacen } from '../entities/almacen.entity';
import { CreateAlmacenDto } from '../dto/create-almacen.dto';
import { UpdateAlmacenDto } from '../dto/update-almacen.dto';

function normalizeName(s: string) {
  return s.trim().replace(/\s+/g, ' ');
}

@Injectable()
export class AlmacenesService {
  constructor(
    @InjectRepository(Almacen)
    private readonly almacenRepository: Repository<Almacen>,
  ) {}

  async create(dto: CreateAlmacenDto) {
    const nombre = normalizeName(dto.nombre_almacen);

    const exists = await this.almacenRepository.findOne({
      where: { nombre_almacen: ILike(nombre) },
      withDeleted: true,
    });
    if (exists) throw new ConflictException('Ya existe un almacén con ese nombre');

    const nuevo = this.almacenRepository.create({ nombre_almacen: nombre });
    const saved = await this.almacenRepository.save(nuevo);
    return { message: 'Almacén registrado correctamente', data: saved };
  }

  async findAll(): Promise<Almacen[]> {
    return this.almacenRepository.find();
  }

  async findOne(id: number): Promise<Almacen> {
    const almacen = await this.almacenRepository.findOne({
      where: { id_almacen_pk: id },
      withDeleted: true,
    });
    if (!almacen) throw new NotFoundException('Almacén no encontrado');
    return almacen;
  }

  async update(id: number, dto: UpdateAlmacenDto) {
    const almacen = await this.almacenRepository.findOne({
      where: { id_almacen_pk: id },
      withDeleted: true,
    });
    if (!almacen) throw new NotFoundException('Almacén no encontrado');

    if (dto.nombre_almacen) {
      const nombre = normalizeName(dto.nombre_almacen);
      const dup = await this.almacenRepository.findOne({
        where: { nombre_almacen: ILike(nombre) },
        withDeleted: true,
      });
      if (dup && dup.id_almacen_pk !== id) {
        throw new ConflictException('Ya existe un almacén con ese nombre');
      }
      almacen.nombre_almacen = nombre;
    }

    const saved = await this.almacenRepository.save(almacen);
    return { message: 'Almacén actualizado correctamente', data: saved };
  }

  async remove(id: number) {
    const res = await this.almacenRepository.softDelete(id);
    if (res.affected === 0) throw new NotFoundException('Almacén no encontrado');
    return { message: 'Almacén eliminado correctamente' };
  }

  async restore(id: number) {
    const res = await this.almacenRepository.restore(id);
    if (res.affected === 0) throw new NotFoundException('Almacén no encontrado');
    const restored = await this.findOne(id);
    return { message: 'Almacén restaurado correctamente', data: restored };
  }
}
