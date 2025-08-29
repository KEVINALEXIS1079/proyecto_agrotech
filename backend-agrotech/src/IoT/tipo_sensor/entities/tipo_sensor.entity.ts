// tipo-sensor.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Sensor } from 'src/IoT/sensores/entities/sensore.entity';

@Entity({ name: 'tipo_sensor' })
export class TipoSensor {
  @PrimaryGeneratedColumn()
  id_tipo_sensor_pk: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre_tipo_sensor: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;

  @OneToMany(() => Sensor, (sensor) => sensor.tipo_sensor)
  sensores: Sensor[];
}
