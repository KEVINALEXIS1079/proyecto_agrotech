import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { TipoSensor } from 'src/modules/iot/tipo-sensor/entities/tipo-sensor.entity';
import { Lote } from 'src/modules/cultivo/lotes/entities/lote.entity';

@Entity({ name: 'sensores' })
@Unique(['nombre_sensor'])
export class Sensor {
  @PrimaryGeneratedColumn()
  id_sensor_pk: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre_sensor: string;

  @Column({ type: 'varchar', length: 255 })
  broker_sensor: string;

  @Column({ type: 'int' })
  puerto_sensor: number;

  @Column({ type: 'varchar', length: 255 })
  topico_sensor: string;

  @Column({ type: 'float' })
  valor_minimo_sensor: number;

  @Column({ type: 'float' })
  valor_maximo_sensor: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // ------------------------
  // Último valor medido
  // ------------------------
  @Column({ type: 'float', nullable: true })
  ultimo_valor: number;

  @Column({ type: 'timestamp', nullable: true })
  ultima_medicion: Date;

  // ------------------------
  // Relación con Lote
  // ------------------------
  @ManyToOne(() => Lote, (lote) => lote.sensores, { nullable: false })
  @JoinColumn({ name: 'id_lote_fk' })
  lote: Lote;

  // ------------------------
  // Relación con TipoSensor
  // ------------------------
  @ManyToOne(() => TipoSensor, (tipoSensor) => tipoSensor.sensores, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_tipo_sensor_fk' })
  tipo_sensor: TipoSensor;

  // ------------------------
  // Soft delete
  // ------------------------
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date|null;
}
