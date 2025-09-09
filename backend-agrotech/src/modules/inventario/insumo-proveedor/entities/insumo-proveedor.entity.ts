import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Insumo } from '../../insumos/entities/insumo.entity';
import { Proveedor} from '../../proveedores/entities/proveedores.entity';

/*
  Entidad que representa la relación entre insumos y proveedores.
  Es una tabla intermedia que asocia un insumo con un proveedor.
*/
@Entity({ name: 'insumo_proveedor' })
export class InsumoProveedor {
  // Identificador único de la relación
  @PrimaryGeneratedColumn()
  id_insumo_proveedor_pk: number;

  // Relación con insumo (Muchos registros de esta tabla pueden apuntar al mismo insumo)
  @ManyToOne(() => Insumo, (insumo) => insumo.insumosProveedores, { eager: true })
  @JoinColumn({ name: 'id_insumo_fk' })
  insumo: Insumo;

  // Relación con proveedor (Muchos registros de esta tabla pueden apuntar al mismo proveedor)
  @ManyToOne(() => Proveedor, (proveedor) => proveedor.insumoProveedor, { eager: true })
  @JoinColumn({ name: 'id_proveedor_fk' })
  proveedor: Proveedor;
}
