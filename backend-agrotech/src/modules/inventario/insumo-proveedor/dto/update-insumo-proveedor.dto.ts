import { PartialType } from '@nestjs/swagger';
import { CreateInsumoProveedorDto } from './create-insumo-proveedor.dto';

/*
  Esta clase extiende de CreateInsumosProveedoresDto para permitir la actualización
  de una relación insumo-proveedor. Utiliza PartialType para hacer que todos los campos sean opcionales.
*/
export class UpdateInsumoProveedorDto extends PartialType(CreateInsumoProveedorDto) {}
