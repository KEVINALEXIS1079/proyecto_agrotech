import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insumo } from './entities/insumo.entity';
import { CreateInsumoDto } from './dto/create-insumo.dto';
import { UpdateInsumoDto } from './dto/update-insumo.dto';
import { Almacen } from '../almacenes/entities/almacen.entity';
import { Categoria } from '../categorias/entities/categoria.entity';

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)
    private readonly insumoRepo: Repository<Insumo>,

    @InjectRepository(Almacen)
    private readonly almacenRepo: Repository<Almacen>,

    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async create(createInsumoDto: CreateInsumoDto): Promise<string> {
    const almacen = await this.almacenRepo.findOneBy({ id_almacen_pk: createInsumoDto.id_almacen_fk });
    if (!almacen) throw new BadRequestException(`El almacén especificado no existe`);

    const categoria = await this.categoriaRepo.findOneBy({ id_categoria_pk: createInsumoDto.id_categoria_fk });
    if (!categoria) throw new BadRequestException(`La categoría especificada no existe`);

    const nuevo = this.insumoRepo.create({
      ...createInsumoDto,
      almacen,
      categoria,
    });

    await this.insumoRepo.save(nuevo);
    return 'Insumo registrado correctamente';
  }

  async findAll(): Promise<any[]> {
    const insumos = await this.insumoRepo.find({ relations: ['almacen', 'categoria'] });

    return insumos.map((insumo) => {
      const alerta =
        insumo.stock < 5
          ? ` Stock bajo: Insumo ${insumo.id_insumo_pk} con categoría ${insumo.categoria?.nombre_categoria} solo tiene ${insumo.stock} unidades`
          : null;

      return { ...insumo, alerta };
    });
  }

  async findOne(id: number): Promise<any> {
    const insumo = await this.insumoRepo.findOne({
      where: { id_insumo_pk: id },
      relations: ['almacen', 'categoria'],
      withDeleted: true,
    });
    if (!insumo) throw new NotFoundException('Insumo no encontrado');

    const alerta =
      insumo.stock < 5
        ? ` Stock bajo: Insumo ${insumo.id_insumo_pk} con categoría ${insumo.categoria?.nombre_categoria} solo tiene ${insumo.stock} unidades`
        : null;

    return { ...insumo, alerta };
  }

  async update(id: number, dto: UpdateInsumoDto): Promise<string> {
    const insumo = await this.insumoRepo.findOne({
      where: { id_insumo_pk: id },
      relations: ['almacen', 'categoria'],
    });
    if (!insumo) throw new NotFoundException('Insumo no encontrado');

    if (dto.id_almacen_fk) {
      const almacen = await this.almacenRepo.findOneBy({ id_almacen_pk: dto.id_almacen_fk });
      if (!almacen) throw new BadRequestException(`El almacén con ID ${dto.id_almacen_fk} no existe`);
      insumo.almacen = almacen;
      delete dto.id_almacen_fk;
    }

    if (dto.id_categoria_fk) {
      const categoria = await this.categoriaRepo.findOneBy({ id_categoria_pk: dto.id_categoria_fk });
      if (!categoria) throw new BadRequestException(`La categoría con ID ${dto.id_categoria_fk} no existe`);
      insumo.categoria = categoria;
      delete dto.id_categoria_fk;
    }

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
