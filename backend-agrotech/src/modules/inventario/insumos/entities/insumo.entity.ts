import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { EstadoInsumo } from '../enums/estado-insumo.enum';
import { Almacen } from '../../almacenes/entities/almacen.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { InsumoProveedor } from '../../insumo-proveedor/entities/insumo-proveedor.entity';
import { MovimientoInsumo } from '../../movimiento-insumo/entities/movimiento-insumo.entity';

@Entity({ name: 'insumos' })
export class Insumo {
  @PrimaryGeneratedColumn()
  id_insumo_pk: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  costo: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({
  type: 'enum',
  enum: EstadoInsumo,
  default: EstadoInsumo.ACTIVO,
})
estado_insumo: EstadoInsumo;


  @Column({ type: 'varchar', length: 50 })
  unidad_medida: string;

  @Column({ type: 'timestamp' })
  fecha_ingreso: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_salida: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_vencimiento: Date;

  @ManyToOne(() => Almacen, (almacen) => almacen.insumos, { eager: false })
  almacen: Almacen;

  @ManyToOne(() => Categoria, (categoria) => categoria.insumos, { eager: false })
  categoria: Categoria;

  // Relación inversa hacia InsumoProveedor
  @OneToMany(() => InsumoProveedor, (insumoProveedor) => insumoProveedor.insumo)
  insumosProveedores: InsumoProveedor[];

  // Relación inversa hacia MovimientoInsumo
  @OneToMany(() => MovimientoInsumo, (movimiento) => movimiento.insumo)
  movimientos: MovimientoInsumo[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;
}
