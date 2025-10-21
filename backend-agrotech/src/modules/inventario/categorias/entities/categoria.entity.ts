// src/modules/inventario/categorias/entities/categoria.entity.ts
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';

@Entity({ name: 'categorias' })
@Index('uq_categorias_nombre', ['nombre_categoria'], { unique: true })
export class Categoria {
  @PrimaryGeneratedColumn()
  id_categoria_pk: number;

  // Alineado con DTO: 50
  @Column({ type: 'varchar', length: 50 })
  nombre_categoria: string;

  // Alineado con DTO: 150
  @Column({ type: 'varchar', length: 150 })
  descripcion_categoria: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  // Relación: Una categoría puede tener muchos insumos
  @OneToMany(() => Insumo, (insumo) => insumo.categoria)
  insumos: Insumo[];
}
