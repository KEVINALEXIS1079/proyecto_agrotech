import { 
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { MovimientoProducto } from 'src/modules/finanzas/movimiento-producto/entities/movimiento-producto.entity';

@Entity({ name: 'productos' })
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto_pk: number;

  @Column({ length: 100 })
  nombre_producto: string;

  @Column({ type: 'text', nullable: true })
  descripcion_producto: string;

  @Column('numeric', { precision: 10, scale: 2 })
  precio_producto: number;

  @Column('bigint')
  stock_producto: number;

  @Column({ type: 'timestamp' })
  fecha_ingreso_producto: Date;

  @Column({ type: 'date' })
  fecha_caducidad_producto: Date;

  // Relación con Cultivo
  @ManyToOne(() => Cultivo, (cultivo) => cultivo.productos)
  @JoinColumn({ name: 'id_cultivo_fk' })
  cultivo: Cultivo;

  // Relación con Movimientos de Productos
  @OneToMany(() => MovimientoProducto, (mp) => mp.producto)
  movimientosProductos: MovimientoProducto[];

  @DeleteDateColumn({ type: 'timestamp' })
  delete_at: Date;
}
