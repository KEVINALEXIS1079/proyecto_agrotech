import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'permiso_module' })
export class PermisoModule {
  @PrimaryGeneratedColumn()
  id_permiso_module_pk: number;

  @Column({ unique: true })
  nombre: string;
}
