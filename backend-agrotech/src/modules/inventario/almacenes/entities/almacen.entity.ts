// src/modules/almacenes/entities/almacen.entity.ts
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';

@Entity({ name: 'almacenes' })
@Index('uq_almacenes_nombre', ['nombre_almacen'], { unique: true })
export class Almacen {
  @PrimaryGeneratedColumn()
  id_almacen_pk: number;

  // Alineado con el DTO: 50
  @Column({ length: 50 })
  nombre_almacen: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Insumo, (insumo) => insumo.almacen)
  insumos: Insumo[];
}
