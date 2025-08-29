import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoSensor } from 'src/IoT/tipo_sensor/entities/tipo_sensor.entity';
import { Cultivo } from 'src/cultivo/cultivos/entities/cultivo.entity';

@Entity({ name: 'sensores' })
export class Sensor {
  @PrimaryGeneratedColumn()
  id_sensor_pk: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_sensor: string;

  @Column({ type: 'date' })
  fecha_inicio_sensor: Date;

  @Column({ type: 'date' })
  fecha_fin_sensor: Date;

  // Relación con Cultivo
  @ManyToOne(() => Cultivo, (cultivo) => cultivo.sensores, { nullable: false })
  @JoinColumn({ name: 'id_cultivo_fk' })
  cultivo: Cultivo;

  // Relación con TipoSensor
  @ManyToOne(() => TipoSensor, (tipoSensor) => tipoSensor.sensores, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_tipo_sensor_fk' })
  tipo_sensor: TipoSensor;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}
