import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UsuarioActividad } from '../../usuario_actividad/entities/usuario_actividad.entity';
import { MovimientoInsumo } from 'src/inventario/movimiento_insumo/entities/movimiento_insumo.entity';
import { Evidencia } from 'src/actividad/evidencias/entities/evidencia.entity';
import { CultivosActividades } from 'src/actividad/cultivos_actividades/entities/cultivos_actividade.entity';

@Entity({ name: 'actividades' })
export class Actividades {
  @PrimaryGeneratedColumn()
  id_actividad_pk: number;

  @Column({ type: 'varchar', length: 255 })
  estado: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'int' })
  tiempo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_mano_obra: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'int' })
  id_tipo_actividad: number;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;

  @OneToMany(() => UsuarioActividad, (usuarioActividad) => usuarioActividad.actividad)
  usuariosActividades: UsuarioActividad[];

  @OneToMany(() => MovimientoInsumo, (movimiento) => movimiento.actividad)
  movimientos: MovimientoInsumo[];

  // 🔗 Relación con Evidencias
  @OneToMany(() => Evidencia, (evidencia) => evidencia.actividad)
  evidencias: Evidencia[];

  @OneToMany(() => CultivosActividades, (ca) => ca.actividad)
  cultivosActividades: CultivosActividades[];
}
