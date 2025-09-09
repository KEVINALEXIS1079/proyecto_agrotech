import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

import { Rol } from '../../roles/entities/rol.entity';
import { UsuarioActividad } from 'src/modules/actividad/usuario-actividad/entities/usuario-actividad.entity';

export enum estado_usuario {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

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

  @Column({
    type: 'enum',
    enum: estado_usuario,
    name: 'estado_usuario',
  })
  estado_usuario: estado_usuario;

  @ManyToOne(() => Rol, rol => rol.usuarios)
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
}
