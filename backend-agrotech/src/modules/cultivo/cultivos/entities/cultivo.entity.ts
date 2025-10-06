import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Sublote } from 'src/modules/cultivo/sublotes/entities/sublote.entity';
import { TipoCultivo } from 'src/modules/cultivo/tipo-cultivo/entities/tipo-cultivo.entity';
import { Sensor } from 'src/modules/iot/sensores/entities/sensor.entity';
import { Epa } from 'src/modules/fitosanitario/epas/entities/epa.entity';
import { CultivoActividad } from 'src/modules/actividad/cultivo-actividad/entities/cultivo-actividad.entity';
import { Evidencia } from 'src/modules/actividad/evidencias/entities/evidencia.entity';
import { Producto } from 'src/modules/finanzas/productos/entities/producto.entity';

@Entity({ name: 'cultivos' })
export class Cultivo {
  @PrimaryGeneratedColumn()
  id_cultivo_pk: number;

  @Column()
  nombre_cultivo:string;

  @Column()
  descripcion_cultivo: string;

 @Column({ type: 'varchar',  nullable: true, length: 255 })
  img_cultivo: string | null;

  @Column()
  estado_cultivo:string;

  @Column({ type: 'date' })
  fecha_inicio_cultivo: Date;

  @Column({ type: 'date' })
  fecha_fin_cultivo: Date;

  @ManyToOne(() => Sublote, (sublote) => sublote.cultivos)
  @JoinColumn({ name: 'id_sublote_fk' })
  sublote: Sublote;

  @ManyToOne(() => TipoCultivo, (tipoCultivo) => tipoCultivo.cultivos)
  @JoinColumn({ name: 'id_tipo_cultivo_fk' })
  tipoCultivo: TipoCultivo;

  // Relación con Sensores
  @OneToMany(() => Sensor, (sensor) => sensor.cultivo)
  sensores: Sensor[];

  // Relación con EPAs
  @OneToMany(() => Epa, (epa) => epa.cultivo)
  epas: Epa[];

  // Relación con CultivosActividades
  @OneToMany(() => CultivoActividad, (ca) => ca.cultivo)
  cultivoActividad: CultivoActividad[];
  
  // Relación con Productos
  @OneToMany(() => Producto, (producto) => producto.cultivo)
  productos: Producto[];

  @DeleteDateColumn({ type: 'timestamp' })
  delete_at: Date;
}
