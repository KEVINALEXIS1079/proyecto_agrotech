import {
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';
import { Actividad } from 'src/modules/actividad/actividades/entities/actividades.entity';

@Entity({ name: 'cultivo_actividad' })
export class CultivoActividad {
  @PrimaryGeneratedColumn()
  id_cultivo_actividad_pk: number;

  // Relación con Cultivo
  @ManyToOne(() => Cultivo, (cultivo) => cultivo.cultivoActividad, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_cultivo_fk' })
  cultivo: Cultivo;

  // Relación con Actividades
  @ManyToOne(() => Actividad, (actividad) => actividad.cultivosActividades, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_actividad_fk' })
  actividad: Actividad;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}
