import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id_categoria_pk: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_categoria: string;

  @Column({ type: 'text' })
  descripcion_categoria: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  // Relación: Una categoría puede tener muchos insumos
  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[];
}
