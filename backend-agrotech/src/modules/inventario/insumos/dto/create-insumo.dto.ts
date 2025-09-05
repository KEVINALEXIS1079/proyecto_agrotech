import {
  IsNumber,
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/*
  DTO para crear un nuevo insumo.
  Valida tipo y formato de los campos.
*/
export class CreateInsumoDto {
  @ApiProperty({
    description: 'Costo del insumo',
    examples: [1200.5, 50000, 999.99],
  })
  @IsNumber({ allowNaN: false, allowInfinity: false }, { message: 'El costo debe ser un número válido' })
  costo: number;

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    examples: [10, 200, 500],
  })
  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number;

  @ApiProperty({
    description: 'Unidad de medida del insumo',
    examples: ['kg', 'litros', 'unidades'],
  })
  @IsString({ message: 'La unidad de medida debe ser una cadena de texto' })
  unidad_medida: string;

  @ApiProperty({
    description: 'Fecha de ingreso del insumo',
    examples: ['2025-01-15', '2025-05-20'],
  })
  @IsDateString({}, { message: 'La fecha de ingreso debe ser una fecha válida' })
  fecha_ingreso: string;

  @ApiProperty({
    description: 'Fecha de salida del insumo (opcional)',
    required: false,
    examples: ['2025-02-01', '2025-06-10'],
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de salida debe ser una fecha válida' })
  fecha_salida?: string;

  @ApiProperty({
    description: 'Fecha de vencimiento del insumo (opcional)',
    required: false,
    examples: ['2026-01-01', '2025-12-31'],
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de vencimiento debe ser una fecha válida' })
  fecha_vencimiento?: string;

  @ApiProperty({
    description: 'ID del almacén al que pertenece el insumo',
    examples: [1, 3, 7],
  })
  @IsInt({ message: 'El id_almacen_fk debe ser un número entero' })
  id_almacen_fk: number;

  @ApiProperty({
    description: 'ID de la categoría a la que pertenece el insumo',
    examples: [2, 5, 8],
  })
  @IsInt({ message: 'El id_categoria_fk debe ser un número entero' })
  id_categoria_fk: number;
}
