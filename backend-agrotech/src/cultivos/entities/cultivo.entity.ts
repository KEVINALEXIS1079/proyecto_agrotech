import { Sublote } from 'src/sublotes/entities/sublote.entity';
import { TipoCultivo } from 'src/tipo-cultivo/entities/tipo-cultivo.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cultivos' })
export class Cultivo {
  // Identificador único del cultivo
  @PrimaryGeneratedColumn()
  id_cultivo_pk: number;

  // Descripción breve del cultivo
  @Column()
  descripcion_cultivo: string;

  // Precio
  @Column('decimal', { precision: 10, scale: 2 }) // Esto es más preciso que 'number'
  precio_cultivo: number;

  // Presentación (ej: "saco de 50kg", "unidad", etc.)
  @Column()
  presentacion_cultivo: string;

  // Fecha de inicio del cultivo
  @Column({ type: 'date' })
  fecha_inicio_cultivo: Date;

  // Fecha de finalización del cultivo
  @Column({ type: 'date' })
  fecha_fin_cultivo: Date;

  // Relación con el sublote
  @ManyToOne(() => Sublote, (sublote) => sublote.cultivos, { eager: false })
  @JoinColumn({ name: 'id_sublote_fk' })
  sublote: Sublote;

  // Relación muchos a uno: muchos cultivos pueden estar asociados a un tipo de cultivo.
  @ManyToOne(() => TipoCultivo, (tipoCultivo) => tipoCultivo.cultivos, {
    eager: false,
  })
  @JoinColumn({ name: 'id_tipo_cultivo_fk' })
  tipoCultivo: TipoCultivo;

  // Fecha de eliminación lógica (soft delete)
  @DeleteDateColumn({ type: 'timestamp' })
  delete_at: Date;
}
