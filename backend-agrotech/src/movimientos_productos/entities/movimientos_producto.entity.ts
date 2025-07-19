export class MovimientosProducto {}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';

export enum TipoMovimiento {
  ENTRADA = 'entrada',
  SALIDA = 'salida',
}

@Entity('movimientos_productos')
export class MovimientosProductos {
  @PrimaryGeneratedColumn({ name: 'id_movimiento_producto_pk' })
  id_movimiento_producto_pk: number;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto_fk' })
  producto: Producto;

  @Column({ type: 'enum', enum: TipoMovimiento })
  tipo_movimiento: TipoMovimiento;

  @Column({ type: 'numeric' })
  cantida: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'text' })
  descripcion: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;
}