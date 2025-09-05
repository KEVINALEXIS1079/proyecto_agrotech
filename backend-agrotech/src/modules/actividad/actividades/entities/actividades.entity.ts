import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UsuarioActividad } from '../../usuario-actividad/entities/usuario-actividad.entity';
import { MovimientoInsumo } from 'src/modules/inventario/movimiento-insumo/entities/movimiento-insumo.entity';
import { Evidencia } from 'src/modules/actividad/evidencias/entities/evidencia.entity';
import { CultivoActividad } from 'src/modules/actividad/cultivo-actividad/entities/cultivo-actividad.entity';

@Entity({ name: 'actividades' })
export class Actividad {
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
  usuarioActividad: UsuarioActividad[];

  @OneToMany(() => MovimientoInsumo, (movimiento) => movimiento.actividad)
  movimientos: MovimientoInsumo[];

  //  Relación con Evidencias
  @OneToMany(() => Evidencia, (evidencia) => evidencia.actividad)
  evidencias: Evidencia[];

  @OneToMany(() => CultivoActividad, (ca) => ca.actividad)
  cultivosActividades: CultivoActividad[];
}
