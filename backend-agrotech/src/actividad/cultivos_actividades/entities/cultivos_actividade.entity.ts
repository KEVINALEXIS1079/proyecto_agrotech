import {
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cultivo } from 'src/cultivo/cultivos/entities/cultivo.entity';
import { Actividades } from 'src/actividad/actividades/entities/actividades.entity';

@Entity({ name: 'cultivos_actividades' })
export class CultivosActividades {
  @PrimaryGeneratedColumn()
  id_cultivo_actividad_pk: number;

  // Relación con Cultivo
  @ManyToOne(() => Cultivo, (cultivo) => cultivo.cultivosActividades, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_cultivo_fk' })
  cultivo: Cultivo;

  // Relación con Actividades
  @ManyToOne(() => Actividades, (actividad) => actividad.cultivosActividades, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_actividad_fk' })
  actividad: Actividades;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}
