import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Sublote } from 'src/sublotes/entities/sublote.entity';

@Entity({ name: 'lotes' })
export class Lote {

//Identificador único del lote (llave primaria).
  @PrimaryGeneratedColumn()
  id_lote_pk: number;


//Área del lote en metros cuadrados (u otra unidad definida por el sistema).
  @Column({ type: 'float' })
  area_lote: number;


//Relación uno a muchos: un lote puede contener varios sublotes.

  @OneToMany(() => Sublote, (sublote) => sublote.lote)
  sublotes: Sublote[];

  // Fecha de eliminación lógica (soft delete)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date | null;
}
