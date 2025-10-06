import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Rol } from '../../roles/entities/rol.entity';
import { UsuarioActividad } from 'src/modules/actividad/usuario-actividad/entities/usuario-actividad.entity';
import { EstadoUsuario } from '../enums/estado-usuario.enum';
import { Permiso } from 'src/modules/permisos/entities/permiso.entity';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario_pk: number;

  @Column()
  cedula_usuario: string;

  @Column()
  nombre_usuario: string;

  @Column()
  apellido_usuario: string;

  @Column()
  telefono_usuario: string;

  @Column()
  correo_usuario: string;

  @Column()
  contrasena_usuario: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  img_usuario?: string | null;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    name: 'estado_usuario',
  })
  estado_usuario: EstadoUsuario;

  @ManyToOne(() => Rol, rol => rol.usuarios, { eager: true })
  @JoinColumn({ name: 'id_rol_fk' })
  rol: Rol;

  // Relación con UsuarioActividad (inversa)
  @OneToMany(() => UsuarioActividad, usuarioActividad => usuarioActividad.usuario)
  actividades: UsuarioActividad[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date | null;

  // Campos para recuperación de contraseña
  @Column({ type: 'varchar', nullable: true })
  codigo_recuperacion: string | null;

  @Column({ type: 'timestamp', nullable: true })
  codigo_expiracion: Date | null;

  // Relación con permisos directos (además de los del rol)
  @ManyToMany(() => Permiso, { eager: true })
  @JoinTable({
    name: 'usuario_permisos',
    joinColumn: { name: 'usuario_id', referencedColumnName: 'id_usuario_pk' },
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id_permiso_pk' },
  })
  permisos: Permiso[];
}