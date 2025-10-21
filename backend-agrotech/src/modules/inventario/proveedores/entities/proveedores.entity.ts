import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany } from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity'; // <-- importa Insumo

@Entity({ name: 'proveedores' })
export class Proveedor {
  @PrimaryGeneratedColumn()
  id_proveedor_pk: number;

  @Column({ type: 'varchar', length: 255 })
  nombre_proveedor: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion_proveedor: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email_proveedor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono_proveedor: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  delete_at: Date;


  @OneToMany(() => Insumo, (i) => i.proveedor)
  insumos: Insumo[];
}
