import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Actividad } from 'src/modules/actividad/actividades/entities/actividad.entity';

@Entity({ name: 'tipo_actividad' })
export class TipoActividad {
  @PrimaryGeneratedColumn()
  id_tipo_actividad_pk: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_tipo_actividad: string;

  // Relación con Actividades
  @OneToMany(() => Actividad, (actividad) => actividad.tipoActividad)
  actividades: Actividad[];

  @DeleteDateColumn({ type: 'timestamp' })
  delete_at: Date;
}
