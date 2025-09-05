import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insumo } from './entities/insumo.entity';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepo: Repository<Insumo>,
  ) {}

  async create(dto: CreateInsumoDto): Promise<string> {
    const nuevo = this.insumoRepo.create(dto);
    await this.insumoRepo.save(nuevo);
    return 'Insumo registrado correctamente';
  }

  async findAll(): Promise<Insumo[]> {
    return await this.insumoRepo.find();
  }

  async findOne(id: number): Promise<Insumo> {
    const insumo = await this.insumoRepo.findOne({
      where: { id_insumo_pk: id },
      withDeleted: true,
    });
    if (!insumo) throw new NotFoundException('Insumo no encontrado');
    return insumo;
  }

  async update(id: number, dto: UpdateInsumoDto): Promise<string> {
    const insumo = await this.insumoRepo.findOneBy({ id_insumo_pk: id });
    if (!insumo) throw new NotFoundException('Insumo no encontrado');

    Object.assign(insumo, dto);
    await this.insumoRepo.save(insumo);
    return 'Insumo actualizado correctamente';
  }

  async remove(id: number): Promise<string> {
    const result = await this.insumoRepo.softDelete({ id_insumo_pk: id });
    if (result.affected === 0) throw new NotFoundException('Insumo no encontrado');
    return 'Insumo eliminado correctamente';
  }

  async restore(id: number): Promise<string> {
    const result = await this.insumoRepo.restore({ id_insumo_pk: id });
    if (result.affected === 0) throw new NotFoundException('Insumo no encontrado');
    return 'Insumo restaurado correctamente';
  }
}
