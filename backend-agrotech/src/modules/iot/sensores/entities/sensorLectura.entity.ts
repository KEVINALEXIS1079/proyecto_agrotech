// src/modules/iot/sensores/entities/sensor-lectura.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sensor } from './sensor.entity';

@Entity({ name: 'sensor_lectura' })
export class SensorLectura {
  @PrimaryGeneratedColumn()
  id_lectura_pk: number;

  @ManyToOne(() => Sensor, (sensor) => sensor.lecturas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_sensor_fk' })
  id_sensor_fk: Sensor;

  @Column({ type: 'float' })
  valor_sensor_lectura: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_sensor_lectura: Date;
}
