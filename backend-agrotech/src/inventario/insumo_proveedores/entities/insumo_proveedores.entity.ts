import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';
import { Proveedores } from '../../proveedores/entities/proveedores.entity';

/*
  Entidad que representa la relación entre insumos y proveedores.
  Es una tabla intermedia que asocia un insumo con un proveedor.
*/
@Entity({ name: 'insumos_proveedores' })
export class InsumosProveedores {
  // Identificador único de la relación
  @PrimaryGeneratedColumn()
  id_insumo_proveedor_pk: number;

  // Relación con insumo (Muchos registros de esta tabla pueden apuntar al mismo insumo)
  @ManyToOne(() => Insumo, (insumo) => insumo.insumosProveedores, { eager: true })
  @JoinColumn({ name: 'id_insumo_fk' })
  insumo: Insumo;

  // Relación con proveedor (Muchos registros de esta tabla pueden apuntar al mismo proveedor)
  @ManyToOne(() => Proveedores, (proveedor) => proveedor.insumosProveedores, { eager: true })
  @JoinColumn({ name: 'id_proveedor_fk' })
  proveedor: Proveedores;
}
