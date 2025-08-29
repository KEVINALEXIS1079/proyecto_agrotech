import { IsInt } from 'class-validator';

/*
  DTO para crear una nueva relación insumo-proveedor.
  Valida que los IDs de insumo y proveedor sean enteros.
*/
export class CreateInsumosProveedoresDto {
  // ID del insumo
  @IsInt({ message: 'El id_insumo_fk debe ser un número entero' })
  id_insumo_fk: number;

  // ID del proveedor
  @IsInt({ message: 'El id_proveedor_fk debe ser un número entero' })
  id_proveedor_fk: number;
}
