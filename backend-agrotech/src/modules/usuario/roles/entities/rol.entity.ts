import { Entity, PrimaryGeneratedColumn, Column, OneToMany, DeleteDateColumn, ManyToMany, JoinTable } from "typeorm";
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Permiso } from "src/modules/permisos/entities/permiso.entity";

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol_pk: number;

  @Column()
  nombre_rol: string;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date | null;

  //  Relación con permisos
  @ManyToMany(() => Permiso, { eager: true })
  @JoinTable({
    name: 'rol_permisos',
    joinColumn: { name: 'rol_id', referencedColumnName: 'id_rol_pk' },
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id_permiso_pk' },
  })
  permisos: Permiso[];
}
