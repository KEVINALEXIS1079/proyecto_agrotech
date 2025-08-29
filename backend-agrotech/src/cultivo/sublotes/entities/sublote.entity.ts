import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Lote } from 'src/cultivo/lotes/entities/lote.entity';
import { Cultivo } from 'src/cultivo/cultivos/entities/cultivo.entity';

@Entity({ name: 'sublotes' })
export class Sublote {
  // Identificador único del sublote (llave primaria autoincremental)
  @PrimaryGeneratedColumn()
  id_sublote_pk: number;

  // Coordenada de latitud del sublote (formato numérico)
  @Column({ type: 'float' })
  latitud_sublote: number;

  // Coordenada de longitud del sublote (formato numérico)
  @Column({ type: 'float' })
  longitud_sublote: number;

  // Nombre asignado al sublote
  @Column({ type: 'varchar', length: 100 })
  nombre_sublote: string;

  // Descripción breve del sublote
  @Column({ type: 'text' })
  descripcion_sublote: string;

  /*
      Relación muchos-a-uno:
      Varios sublotes pueden pertenecer a un mismo lote.
      Se almacena en la columna 'id_lote_fk'.
    */
  @ManyToOne(() => Lote, (lote) => lote.sublotes)
  @JoinColumn({ name: 'id_lote_fk' })
  lote: Lote;

  /*
      Relación uno-a-muchos:
      Un sublote puede tener múltiples cultivos.
    */
  @OneToMany(() => Cultivo, (cultivo) => cultivo.sublote)
  cultivos: Cultivo[];

  // Fecha de eliminación lógica (soft delete)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date | null;

}
