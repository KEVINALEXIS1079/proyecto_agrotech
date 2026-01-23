import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { PermisoModule } from 'src/modules/permiso-module/entities/permiso-module.entity';
import { Rol } from 'src/modules/usuario/roles/entities/rol.entity';
import { Usuario } from 'src/modules/usuario/usuarios/entities/usuario.entity';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  id_permiso_pk: number;

  @Column({ type: 'varchar', length: 50 })
  accion: string;

  @Column({ type: 'varchar', length: 150 })
  modulo: string;

  @Column({ type: 'varchar', length: 200, unique: true })
  permisoCompleto: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // Relación con el módulo de permisos
  @ManyToOne(() => PermisoModule, { eager: true, nullable: false })
  @JoinColumn({ name: 'id_permiso_module_fk' })
  module: PermisoModule;

  // Relación muchos a muchos con roles
  @ManyToMany(() => Rol, (rol) => rol.permisos)
  roles: Rol[];

  // Relación muchos a muchos con usuarios
  @ManyToMany(() => Usuario, (usuario) => usuario.permisos)
  usuarios: Usuario[];
}