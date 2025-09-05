import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, DeleteDateColumn, Column } from 'typeorm';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';
import { Actividad } from '../../actividades/entities/actividades.entity';

@Entity({ name: 'usuario_actividad' })
export class UsuarioActividad {
  @PrimaryGeneratedColumn()
  id_usuarios_actividades_pk: number;

  // Relación con Usuario
  @ManyToOne(() => Usuario, usuario => usuario.actividades, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  // Relación con Actividades
  @ManyToOne(() => Actividad, actividad => actividad.usuarioActividad, { eager: true })
  @JoinColumn({ name: 'id_actividad' })
  actividad: Actividad;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;

  @Column({ nullable: true })
codigo_recuperacion?: string;

@Column({ type: 'timestamp', nullable: true })
codigo_expiracion?: Date;
}
