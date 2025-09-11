import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { UsuarioActividad } from '../../usuario-actividad/entities/usuario-actividad.entity';
import { MovimientoInsumo } from 'src/modules/inventario/movimiento-insumo/entities/movimiento-insumo.entity';
import { Evidencia } from 'src/modules/actividad/evidencias/entities/evidencia.entity';
import { CultivoActividad } from 'src/modules/actividad/cultivo-actividad/entities/cultivo-actividad.entity';
import { TipoActividad } from 'src/modules/actividad/tipo-actividad/entities/tipo-actividad.entity';

@Entity({ name: 'actividades' })
export class Actividad {
  @PrimaryGeneratedColumn()
  id_actividad_pk: number;

  @Column({ type: 'enum', enum: ['Pendiente', 'En progreso', 'Completada', 'Cancelada'] })
  estado_actividad: string;

  @Column({ type: 'text' })
  descripcion_actividad: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_actividad: string;

  @Column({ type: 'int' })
  tiempo_actividad: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  costo_mano_obra_actividad: number;

  @Column({ type: 'date' })
  fecha_actividad: Date;

  @Column({ type: 'timestamp' })
  fecha_inicio_actividad: Date;

  @Column({ type: 'timestamp' })
  fecha_fin_actividad: Date;

  // Relación con TipoActividad
  @ManyToOne(() => TipoActividad, (tipoActividad) => tipoActividad.actividades)
  @JoinColumn({ name: 'id_tipo_actividad_fk' })
  tipoActividad: TipoActividad;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;

  // Relación con UsuarioActividad
  @OneToMany(() => UsuarioActividad, (usuarioActividad) => usuarioActividad.actividad)
  usuarioActividad: UsuarioActividad[];

  // Relación con MovimientoInsumo
  @OneToMany(() => MovimientoInsumo, (movimiento) => movimiento.actividad)
  movimientos: MovimientoInsumo[];

  // Relación con Evidencias
  @OneToMany(() => Evidencia, (evidencia) => evidencia.actividad)
  evidencias: Evidencia[];

  // Relación con CultivoActividad
  @OneToMany(() => CultivoActividad, (ca) => ca.actividad)
  cultivosActividades: CultivoActividad[];
}
