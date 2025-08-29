import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, DeleteDateColumn } from 'typeorm';
import { Insumo } from 'src/inventario/insumos/entities/insumo.entity';
import { Actividades } from 'src/actividad/actividades/entities/actividades.entity';

@Entity('movimientos_insumos')
export class MovimientoInsumo {
  @PrimaryGeneratedColumn()
  id_movimiento_insumo_pk: number;

  @Column({ type: 'varchar', length: 20 })
  tipo_movimiento: string; // entrada | salida

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'varchar', length: 20 })
  unidad: string;

  @Column({ type: 'timestamp' })
  fecha_movimiento: Date;

  @Column({ type: 'varchar', length: 100 })
  motivo: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Insumo, (insumo) => insumo.movimientos)
  insumo: Insumo;

  @ManyToOne(() => Actividades, (actividad) => actividad.movimientos, { nullable: true })
  actividad: Actividades;
}
