// src/modules/inventario/insumo-proveedor/entities/insumo-proveedor.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';
import { Proveedor } from '../../proveedores/entities/proveedores.entity'; 

@Entity({ name: 'insumo_proveedor' })
export class InsumoProveedor {
  @PrimaryGeneratedColumn()
  id_insumo_proveedor_pk: number;

  @ManyToOne(() => Insumo, { eager: true })
  @JoinColumn({ name: 'id_insumo_fk' })
  insumo: Insumo;

  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor_fk' })
  proveedor: Proveedor;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
