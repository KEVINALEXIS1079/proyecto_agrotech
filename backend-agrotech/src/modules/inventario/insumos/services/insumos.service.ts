import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insumo } from '../entities/insumo.entity';
import { CreateInsumoDto } from '../dto/create-insumo.dto';
import { UpdateInsumoDto } from '../dto/update-insumo.dto';
import { Almacen } from '../../almacenes/entities/almacen.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedores.entity';

type InsumoListItem = {
  id: number;
  imagen: string | null;
  nombre: string;
  categoria: string;
  stock: string;               // "20 bultos"
  cantidadPorUnidad: number;   // 50
  unidadMedida: string;        // "kg"
  totalContenido: number;      // 1000  (stock_unidades*contenido + suelto)
  precio: number;              // 20000
  fechaIngreso: string;        // "2025-07-20"
  almacen: string;             // "Principal"
};

@Injectable()
export class InsumosService {
  constructor(
    @InjectRepository(Insumo)    private readonly insumoRepo: Repository<Insumo>,
    @InjectRepository(Almacen)   private readonly almacenRepo: Repository<Almacen>,
    @InjectRepository(Categoria) private readonly categoriaRepo: Repository<Categoria>,
    @InjectRepository(Proveedor) private readonly proveedorRepo: Repository<Proveedor>,
  ) {}

  async create(dto: CreateInsumoDto): Promise<string> {
    const almacen = await this.almacenRepo.findOneBy({ id_almacen_pk: dto.id_almacen_fk });
    if (!almacen) throw new BadRequestException('El almacén especificado no existe');

    const categoria = await this.categoriaRepo.findOneBy({ id_categoria_pk: dto.id_categoria_fk });
    if (!categoria) throw new BadRequestException('La categoría especificada no existe');

    let proveedor: Proveedor | null = null;
    if (dto.id_proveedor_fk != null) {
      proveedor = await this.proveedorRepo.findOneBy({ id_proveedor_pk: dto.id_proveedor_fk }) ?? null;
      if (!proveedor) throw new BadRequestException(`El proveedor con ID ${dto.id_proveedor_fk} no existe`);
    }

    const nuevo = this.insumoRepo.create({
      ...dto,
      almacen,
      categoria,
      proveedor,
    });

    await this.insumoRepo.save(nuevo);
    return 'Insumo registrado correctamente';
  }

  async findAll(almacenId?: number): Promise<InsumoListItem[]> {
    const where = almacenId ? { almacen: { id_almacen_pk: almacenId } } : {};
    const insumos = await this.insumoRepo.find({
      where,
      relations: ['almacen', 'categoria'],
    });

    return insumos.map((i) => ({
      id: i.id_insumo_pk,
      imagen: i.img_url ?? null,
      nombre: i.nombre,
      categoria: i.categoria?.nombre_categoria ?? '—',
      stock: `${i.stock_unidades} ${i.presentacion}${i.stock_unidades === 1 ? '' : 's'}`,
      cantidadPorUnidad: Number(i.contenido_por_unidad),
      unidadMedida: i.unidad_contenido,
      totalContenido: Number(i.stock_unidades) * Number(i.contenido_por_unidad) + Number(i.stock_contenido_suelto ?? 0),
      precio: Number(i.precio_presentacion),
      fechaIngreso: i.fecha_ingreso,
      almacen: i.almacen?.nombre_almacen ?? '—',
    }));
  }

  async findOne(id: number) {
    const i = await this.insumoRepo.findOne({
      where: { id_insumo_pk: id },
      relations: ['almacen', 'categoria', 'proveedor'],
      withDeleted: true,
    });
    if (!i) throw new NotFoundException('Insumo no encontrado');

    const totalContenido =
      Number(i.stock_unidades) * Number(i.contenido_por_unidad) +
      Number(i.stock_contenido_suelto ?? 0);

    return {
      ...i,
      totalContenido,
      almacen_nombre: i.almacen?.nombre_almacen ?? '—',
      categoria_nombre: i.categoria?.nombre_categoria ?? '—',
      proveedor_nombre: i.proveedor?.nombre_proveedor ?? null,
    };
  }

  async update(id: number, dto: UpdateInsumoDto): Promise<string> {
    const insumo = await this.insumoRepo.findOne({
      where: { id_insumo_pk: id },
      relations: ['almacen', 'categoria', 'proveedor'],
    });
    if (!insumo) throw new NotFoundException('Insumo no encontrado');

    if (dto.id_almacen_fk != null) {
      const almacen = await this.almacenRepo.findOneBy({ id_almacen_pk: dto.id_almacen_fk });
      if (!almacen) throw new BadRequestException(`El almacén con ID ${dto.id_almacen_fk} no existe`);
      insumo.almacen = almacen;
      delete (dto as any).id_almacen_fk;
    }

    if (dto.id_categoria_fk != null) {
      const categoria = await this.categoriaRepo.findOneBy({ id_categoria_pk: dto.id_categoria_fk });
      if (!categoria) throw new BadRequestException(`La categoría con ID ${dto.id_categoria_fk} no existe`);
      insumo.categoria = categoria;
      delete (dto as any).id_categoria_fk;
    }

    if ((dto as any).id_proveedor_fk != null) {
      const proveedor = await this.proveedorRepo.findOneBy({ id_proveedor_pk: (dto as any).id_proveedor_fk });
      if (!proveedor) throw new BadRequestException(`El proveedor con ID ${(dto as any).id_proveedor_fk} no existe`);
      insumo.proveedor = proveedor;
      delete (dto as any).id_proveedor_fk;
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
