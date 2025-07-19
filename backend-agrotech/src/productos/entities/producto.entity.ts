import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn } from 'typeorm';
import { MovimientosProductos } from 'src/movimientos_productos/entities/movimientos_producto.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'id_producto_pk' })
  id_producto_pk: number;

  @Column({ name: 'nombre_producto', type: 'varchar', length: 100 })
  nombre_producto: string;

  @Column({ name: 'descripcion_producto', type: 'varchar', length: 255 })
  descripcion_producto: string;

  @Column({ name: 'precio_producto', type: 'numeric' })
  precio_producto: number;

  @Column({ name: 'stock_producto', type: 'bigint' })
  stock_producto: number;

  @Column({ name: 'fecha_ingreso_producto', type: 'timestamp' })
  fecha_ingreso_producto: Date;

  @Column({ name: 'fecha_caducidad_producto', type: 'date' })
  fecha_caducidad_producto: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Relación con movimientos_productos
  @OneToMany(() => MovimientosProductos, movimiento => movimiento.producto)
  movimientos: MovimientosProductos[];
}