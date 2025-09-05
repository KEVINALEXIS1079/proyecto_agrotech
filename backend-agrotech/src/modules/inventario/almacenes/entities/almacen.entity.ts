import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';

@Entity({ name: 'almacenes' })
export class Almacen {
  @PrimaryGeneratedColumn()
  id_almacen_pk: number;

  @Column({ length: 100 })
  nombre_almacen: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  // relacion de uno a muchos con insumo ya que un almacen puede tener muchos insumos

  @OneToMany(() => Insumo, (insumo) => insumo.almacen)
  insumos: Insumo[];
}