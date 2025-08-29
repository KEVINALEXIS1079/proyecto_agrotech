import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, DeleteDateColumn, Column } from 'typeorm';
import { Usuario } from 'src/usuario/usuarios/entities/usuario.entity';
import { Actividades } from '../../actividades/entities/actividades.entity';

@Entity({ name: 'usuarios_actividades' })
export class UsuarioActividad {
  @PrimaryGeneratedColumn()
  id_usuarios_actividades_pk: number;

  // Relación con Usuario
  @ManyToOne(() => Usuario, usuario => usuario.actividades, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Relación con Actividades
  @ManyToOne(() => Actividades, actividad => actividad.usuariosActividades, { eager: true })
  @JoinColumn({ name: 'id_actividad' })
  actividad: Actividades;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;

  @Column({ nullable: true })
codigo_recuperacion?: string;

@Column({ type: 'timestamp', nullable: true })
codigo_expiracion?: Date;
}
