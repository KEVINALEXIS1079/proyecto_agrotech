import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Actividad } from 'src/modules/actividad/actividades/entities/actividad.entity';
import { Cultivo } from 'src/modules/cultivo/cultivos/entities/cultivo.entity';

@Entity('evidencias')
export class Evidencia {
  @PrimaryGeneratedColumn({})
  id_evidencia_pk: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_evidencia: string;

  @Column({ type: 'varchar', length: 500 })
  descripcion_evidencia: string;

  @Column({ type: 'date' })
  fecha_evidencia: Date;

  @Column({ type: 'varchar', length: 500 })
  observacion_evidencia: string;

  @Column({ type: 'timestamp', nullable: true })
  fecha_inicio_evidencia: Date;


  @Column({ type: 'timestamp', nullable: true }) 
  fecha_fin_evidencia: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img_evidencia?: string | null;

  //  Relación con Actividades
  @ManyToOne(() => Actividad, (actividad) => actividad.evidencias, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_actividad_fk' })
  actividad: Actividad;

  @Column({ type: 'int' })
  id_actividad_fk: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}
