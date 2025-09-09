import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MovimientoProducto } from 'src/modules/finanzas/movimiento-producto/entities/movimiento-producto.entity';

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta_pk: number;

  @Column('numeric')
  cantidad: number;

  @Column('numeric')
  precio_unitario: number;

  @Column({ type: 'date' })
  fecha: Date;

  // Relación con Movimientos de Productos
  @OneToMany(() => MovimientoProducto, (mp) => mp.venta)
  movimientosProductos: MovimientoProducto[];
}
