import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tipo_sensor')
export class TipoSensor {
  @PrimaryGeneratedColumn({ name: 'id_tipo_sensor_pk' })
  id: number;

  @Column({ name: 'nombre_tipo_sensor' })
  nombre: string;
}
