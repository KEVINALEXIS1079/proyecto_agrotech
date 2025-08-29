import { Entity,PrimaryGeneratedColumn,Column, OneToMany, DeleteDateColumn } from "typeorm";
import {Usuario} from '../../usuarios/entities/usuario.entity'

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol_pk: number;

  @Column()
  nombre_rol: string;

  @OneToMany(() => Usuario, usuario => usuario.rol)
usuarios: Usuario[];

  @DeleteDateColumn({type:'timestamp',nullable: true})delete_at: Date | null;
}
