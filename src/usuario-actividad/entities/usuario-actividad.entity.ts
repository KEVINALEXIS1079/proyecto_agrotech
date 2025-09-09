
import {
  Column,DeleteDateColumn,Entity,PrimaryGeneratedColumn,} from 'typeorm';

@Entity({ name: 'usuarios-actividades' })
export class UsuarioActividad {

  
  @PrimaryGeneratedColumn()
  id_usuarios_actividades_pk: number;

  
  @Column({ type: 'varchar', length: 20 })
  dni_usuario: string;

  
  @Column({ type: 'int' })
  id_actividad: number;

  // Fecha y hora de eliminación lógica (borrado suave)
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;
}
