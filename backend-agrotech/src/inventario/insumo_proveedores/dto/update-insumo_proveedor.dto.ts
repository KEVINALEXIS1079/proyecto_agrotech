import { PartialType } from '@nestjs/mapped-types';
import { CreateInsumosProveedoresDto } from './create-insumo_proveedor.dto';

/*
  Esta clase extiende de CreateInsumosProveedoresDto para permitir la actualización
  de una relación insumo-proveedor. Utiliza PartialType para hacer que todos los campos sean opcionales.
*/
export class UpdateInsumosProveedoresDto extends PartialType(CreateInsumosProveedoresDto) {}
