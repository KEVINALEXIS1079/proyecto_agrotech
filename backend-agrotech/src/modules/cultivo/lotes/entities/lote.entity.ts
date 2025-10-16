import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sublote } from 'src/modules/cultivo/sublotes/entities/sublote.entity';
@Entity({ name: 'lotes' })
export class Lote {
  @PrimaryGeneratedColumn()
  id_lote_pk: number;

  // Nombre identificador del lote
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre_lote: string;

  @Column({ type: 'float', nullable: false })
  area_lote: number;

  @Column({ type: 'json', nullable: false })
  coordenadas_lote: { latitud_lote: number; longitud_lote: number }[];

  @OneToMany(() => Sublote, (sublote) => sublote.lote)
  sublotes: Sublote[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date | null;
}
