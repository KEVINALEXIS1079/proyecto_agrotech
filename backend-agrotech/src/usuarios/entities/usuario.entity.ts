import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,DeleteDateColumn } from "typeorm";
import { Rol } from '../../roles/entities/role.entity';

export enum estado_usuario{
  ACTVIO='activo',
  INACTIVO='inactivo'
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
  name: 'estado_usuario'
})
estado_usuario: estado_usuario;


  @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: 'id_rol_fk' })
  rol: Rol;

  @DeleteDateColumn({type:'timestamp',nullable: true})delete_at: Date | null;


}
