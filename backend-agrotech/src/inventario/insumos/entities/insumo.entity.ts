import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Almacen } from '../../almacen/entities/almacen.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { InsumosProveedores } from '../../insumo_proveedores/entities/insumo_proveedores.entity';
import { MovimientoInsumo } from 'src/inventario/movimiento_insumo/entities/movimiento_insumo.entity';

@Entity({ name: 'insumos' })
export class Insumo {
  @PrimaryGeneratedColumn()
  id_insumo_pk: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  costo: number;

  @Column({ type: 'int', default: 0 })
  stock: number; // Stock actual del insumo

  @Column({ type: 'varchar', length: 20, default: 'A' })
  estado_insumo: string; // Estado: A = Disponible, M = Medio, B = Bajo

  @Column({ type: 'varchar', length: 50 })
  unidad_medida: string;

  @Column({ type: 'timestamp' })
  fecha_ingreso: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_salida?: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_vencimiento?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date;

  // Relación: un insumo pertenece a un almacén
  @ManyToOne(() => Almacen, (almacen) => almacen.insumos)
  @JoinColumn({ name: 'id_almacen_fk' })
  almacen: Almacen;

  // Relación: un insumo pertenece a una categoría
  @ManyToOne(() => Categoria, (categoria) => categoria.insumos)
  @JoinColumn({ name: 'id_categoria_fk' })
  categoria: Categoria;

  // Relación: un insumo puede estar asociado a muchos proveedores
  @OneToMany(() => InsumosProveedores, (ip) => ip.insumo)
  insumosProveedores: InsumosProveedores[];

  // Relación: un insumo puede tener muchos movimientos
  @OneToMany(() => MovimientoInsumo, (movimiento) => movimiento.insumo)
  movimientos: MovimientoInsumo[];
}
