import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Almacen } from './entities/almacen.entity';
import { CreateAlmacenDto } from './dto/create-almacen.dto';
import { UpdateAlmacenDto } from './dto/update-almacen.dto';

@Injectable()
export class AlmacenesService {
  constructor(
    @InjectRepository(Almacen)
    private readonly almacenRepository: Repository<Almacen>,
  ) {}

  async create(dto: CreateAlmacenDto): Promise<string> {
    const nuevo = this.almacenRepository.create(dto);
    await this.almacenRepository.save(nuevo);
    return 'Almacén registrado correctamente';
  }

  async findAll(): Promise<Almacen[]> {
    return this.almacenRepository.find();
  }

  async findOne(id: number): Promise<Almacen> {
    const almacen = await this.almacenRepository.findOne({
      where: { id_almacen_pk: id },
      withDeleted: true,
    });
    if (!almacen) throw new Error('Almacén no encontrado');
    return almacen;
  }

  async update(id: number, dto: UpdateAlmacenDto): Promise<string> {
    const almacen = await this.almacenRepository.findOneBy({ id_almacen_pk: id });
    if (!almacen) throw new Error('Almacén no encontrado');

    Object.assign(almacen, dto);
    await this.almacenRepository.save(almacen);
    return 'Almacén actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.almacenRepository.softDelete(id);
    if (result.affected === 0) throw new Error('Almacén no encontrado');
    return 'Almacén eliminado correctamente';
  }

  async restore(id: number): Promise<string> {
    const result = await this.almacenRepository.restore(id);
    if (result.affected === 0) throw new Error('Almacén no encontrado');
    return 'Almacén restaurado correctamente';
  }
}