import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { TipoSensor } from 'src/modules/iot/tipo-sensor/entities/tipo-sensor.entity';
import { Lote } from 'src/modules/cultivo/lotes/entities/lote.entity';
import { SensorLectura } from './sensorLectura.entity';

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
  ultimo_valor: number | null;

  @Column({ type: 'timestamp', nullable: true })
  ultima_medicion: Date | null;

  // ------------------------
  // Estado de conexión (nuevo)
  // ------------------------
  @Column({
    type: 'enum',
    enum: ['conectado', 'desconectado'],
    default: 'desconectado',
    comment: 'Estado actual de conexión del sensor al broker MQTT',
  })
  estado_sensor: 'conectado' | 'desconectado';


  // ------------------------
  // Manejo de protocolos
  // ------------------------
  @Column({
    type: 'enum',
    enum: ['HTTP', 'HTTPS', 'WebSocket', 'MQTT'],
    default: 'MQTT',
    comment: 'Protocolo de comunicación del sensor',
  })
  protocolo_sensor: 'HTTP' | 'HTTPS' | 'WebSocket' | 'MQTT';

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
  // Relación con sensorLectura
  // ------------------------
  @OneToMany(() => SensorLectura, (lectura) => lectura.id_sensor_fk)
  lecturas: SensorLectura[];

  // ------------------------
  // Soft delete
  // ------------------------
  @DeleteDateColumn({
    name: 'delete_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;
}
