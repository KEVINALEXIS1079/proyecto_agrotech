// src/modules/inventario/insumos/entities/insumo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { EstadoInsumo } from '../enums/estado-insumo.enum';
import { UnidadContenido, PresentacionInsumo } from '../enums/unidades.enum';
import { Almacen } from '../../almacenes/entities/almacen.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Proveedor } from '../../proveedores/entities/proveedores.entity';
import { InsumoProveedor } from '../../insumo-proveedor/entities/insumo-proveedor.entity';
import { MovimientoInsumo } from '../../movimiento-insumo/entities/movimiento-insumo.entity';

@Entity({ name: 'insumos' })
export class Insumo {
  @PrimaryGeneratedColumn()
  id_insumo_pk: number;

  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  @Column({ type: 'enum', enum: PresentacionInsumo, default: PresentacionInsumo.BULTO })
  presentacion: PresentacionInsumo;

  // p. ej. 50 (el contenido por bulto/caneca/caja)
  @Column({ type: 'numeric', precision: 10, scale: 3 })
  contenido_por_unidad: number;

  // kg, L, ml, und...
  @Column({ type: 'enum', enum: UnidadContenido })
  unidad_contenido: UnidadContenido;

  // stock en unidades de presentación (bultos, canecas...)
  @Column({ type: 'int', default: 0 })
  stock_unidades: number;


  @Column({ type: 'numeric', precision: 12, scale: 3, default: 0 })
  stock_contenido_suelto: number;


  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  precio_presentacion: number;

  @Column({ type: 'enum', enum: EstadoInsumo, default: EstadoInsumo.ACTIVO })
  estado_insumo: EstadoInsumo;

  @Column({ type: 'date' })
  fecha_ingreso: string;

  @Column({ type: 'date', nullable: true })
  fecha_salida: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_vencimiento: string | null;

  @Column({ type: 'varchar', length: 300, nullable: true })
  img_url: string | null;

  @ManyToOne(() => Almacen, (a) => a.insumos, { nullable: false })
  @JoinColumn({ name: 'id_almacen_fk' })
  almacen: Almacen;

  @ManyToOne(() => Categoria, (c) => c.insumos, { nullable: false })
  @JoinColumn({ name: 'id_categoria_fk' })
  categoria: Categoria;


  @ManyToOne(() => Proveedor, (p) => p.insumos, { nullable: true, eager: false })
  @JoinColumn({ name: 'id_proveedor_fk' })
  proveedor: Proveedor | null;

  @OneToMany(() => InsumoProveedor, (ip) => ip.insumo)
  insumosProveedores: InsumoProveedor[];

  @OneToMany(() => MovimientoInsumo, (m) => m.insumo)
  movimientos: MovimientoInsumo[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
