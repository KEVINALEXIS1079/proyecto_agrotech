import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/*
  DTO para crear una nueva relación insumo-proveedor.
  Valida que los IDs de insumo y proveedor sean enteros.
*/
export class CreateInsumoProveedorDto {
  // ID del insumo
  @ApiProperty({
    description: 'ID del insumo asociado',
    examples: [1, 5, 10],
  })
  @IsInt({ message: 'El id_insumo_fk debe ser un número entero' })
  id_insumo_fk: number;

  // ID del proveedor
  @ApiProperty({
    description: 'ID del proveedor asociado',
    examples: [2, 7, 12],
  })
  @IsInt({ message: 'El id_proveedor_fk debe ser un número entero' })
  id_proveedor_fk: number;
}
