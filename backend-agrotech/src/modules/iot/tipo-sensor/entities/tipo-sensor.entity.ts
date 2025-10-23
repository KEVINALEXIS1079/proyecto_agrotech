import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Sensor } from 'src/modules/iot/sensores/entities/sensor.entity';

@Entity({ name: 'tipo_sensor' })
export class TipoSensor {
  @PrimaryGeneratedColumn({ name: 'id_tipo_sensor_pk' })
  id_tipo_sensor_pk: number;

  @Column({
    name: 'nombre_tipo_sensor',
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nombre descriptivo del tipo de sensor (ej: Humedad, Temperatura)',
  })
  nombre_tipo_sensor: string;

  @Column({
    name: 'unidades_tipo_sensor',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Unidad de medida (%, °C, pH, lx, etc.)',
  })
  unidades_tipo_sensor?: string;

  @Column({
    name: 'decimales_tipo_sensor',
    type: 'int',
    nullable: true,
    comment: 'Número de decimales según el tipo de sensor',
  })
  decimales_tipo_sensor?: number;

  @Column({
    name: 'imagen_tipo_sensor',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'URL de la imagen representativa del tipo de sensor',
  })
  imagen_tipo_sensor?: string | null; // OPCIONAL

  @DeleteDateColumn({
    name: 'delete_at',
    type: 'timestamp',
    nullable: true,
  })
  delete_at?: Date;

  // Relación con Sensores
  @OneToMany(() => Sensor, (sensor) => sensor.tipo_sensor)
  sensores: Sensor[];
}
