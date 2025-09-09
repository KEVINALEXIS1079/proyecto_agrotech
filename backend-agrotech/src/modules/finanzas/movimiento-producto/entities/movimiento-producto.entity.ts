import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Producto } from 'src/modules/finanzas/productos/entities/producto.entity';
import { Venta } from 'src/modules/finanzas/ventas/entities/venta.entity';

@Entity({ name: 'movimiento_producto' })
export class MovimientoProducto {
  @PrimaryGeneratedColumn()
  id_movimiento_producto_pk: number;

  @Column({ type: 'enum', enum: ['entrada', 'salida'] }) // Ajusta según tu enum en la BD
  tipo_movimiento: 'entrada' | 'salida';

  @Column('numeric')
  cantidad: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Relación con Producto
  @ManyToOne(() => Producto, (producto) => producto.movimientosProductos)
  @JoinColumn({ name: 'id_producto_fk' })
  producto: Producto;

  // Relación con Venta
  @ManyToOne(() => Venta, (venta) => venta.movimientosProductos)
  @JoinColumn({ name: 'id_venta_fk' })
  venta: Venta;
}
