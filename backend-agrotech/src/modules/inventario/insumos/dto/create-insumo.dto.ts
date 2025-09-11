import {
  IsNumber,
  IsInt,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoInsumo } from '../enums/estado-insumo.enum';

export class CreateInsumoDto {
  @ApiProperty({
    description: 'Costo del insumo',
    examples: [1200.5, 50000],
  })
  @IsNumber({}, { message: 'El costo debe ser un número válido' })
  costo: number;

  @ApiProperty({
    description: 'Cantidad en stock',
    examples: [10, 200],
  })
  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number;

  @ApiProperty({
    description: 'Estado del insumo',
    enum: EstadoInsumo,
    examples: [EstadoInsumo.ACTIVO, EstadoInsumo.INACTIVO],
    required: false,
  })
  @IsOptional()
  @IsEnum(EstadoInsumo, {
    message:
      'El estado debe ser uno de: A (Activo), I (Inactivo), O (Obsoleto), E (En espera), D (Dañado), R (Reservado)',
  })
  estado_insumo?: EstadoInsumo;

  @ApiProperty({
    description: 'Unidad de medida',
    examples: ['kg', 'litros'],
  })
  @IsString({ message: 'La unidad de medida debe ser un texto' })
  unidad_medida: string;

  @ApiProperty({
    description: 'Fecha de ingreso',
    example: '2025-01-15',
  })
  @IsDateString({}, { message: 'La fecha de ingreso debe ser válida' })
  fecha_ingreso: string;

  @ApiProperty({
    description: 'Fecha de salida',
    example: '2025-02-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de salida debe ser válida' })
  fecha_salida?: string;

  @ApiProperty({
    description: 'Fecha de vencimiento',
    example: '2026-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de vencimiento debe ser válida' })
  fecha_vencimiento?: string;

  @ApiProperty({
    description: 'ID del almacén',
    examples: [1, 3, 7],
  })
  @IsInt({ message: 'El id_almacen_fk debe ser un número entero' })
  id_almacen_fk: number;

  @ApiProperty({
    description: 'ID de la categoría',
    examples: [2, 5, 8],
  })
  @IsInt({ message: 'El id_categoria_fk debe ser un número entero' })
  id_categoria_fk: number;
}
