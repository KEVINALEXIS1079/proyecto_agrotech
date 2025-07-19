import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoSensor } from '../../tipo_sensor/entities/tipo_sensor.entity';

@Entity('sensores')
export class Sensor {
  @PrimaryGeneratedColumn({ name: 'id_sensor_pk' })
  id: number;

  @Column()
  nombre: string;

  @Column({ name: 'id_cultivo_fk' })
  idCultivo: number;

  @Column({ name: 'id_tipo_sensor_fk' })
  idTipoSensor: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @ManyToOne(() => TipoSensor)
  @JoinColumn({ name: 'id_tipo_sensor_fk' })
  tipoSensor: TipoSensor;
}
