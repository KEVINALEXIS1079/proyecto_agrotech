import {Column,DeleteDateColumn,Entity,OneToMany,PrimaryGeneratedColumn,} from 'typeorm';
import { InsumosProveedores } from '../../insumo_proveedores/entities/insumo_proveedores.entity';


@Entity({ name: 'proveedores' })
export class Proveedores {
  // Identificador único del proveedor
  @PrimaryGeneratedColumn()
  id_proveedor_pk: number;

  // Campos del proveedor
  @Column({ type: 'varchar', length: 255 })
  nombre_proveedor: string;

  // Dirección del proveedor
  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  // Correo electrónico del proveedor
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  // Número de teléfono del proveedor (opcional)
  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono: string;

  // Marca de tiempo de creación del proveedor
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;

  @OneToMany(() => InsumosProveedores, (ip) => ip.proveedor)
  insumosProveedores: InsumosProveedores[];
}
