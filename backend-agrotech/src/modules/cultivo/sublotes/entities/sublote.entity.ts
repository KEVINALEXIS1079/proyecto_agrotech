import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Lote } from 'src/modules/cultivo/lotes/entities/lote.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';

@Entity({ name: 'sublotes' })
export class Sublote {
  // Identificador único del sublote (llave primaria autoincremental)
  @PrimaryGeneratedColumn()
  id_sublote_pk: number;

  @Column({ type: 'float', nullable: false })
  area_sublote: number;

  @Column({ type: 'json', nullable: false })
  coordenadas_sublote: { latitud_sublote: number; longitud_sublote: number }[];

  // Nombre asignado al sublote
  @Column({ type: 'varchar', length: 100 })
  nombre_sublote: string;

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
