import { 
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Fertilizante orgánico',
  })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre_producto: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Fertilizante natural para mejorar la calidad del suelo',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  descripcion_producto?: string;

  @ApiProperty({
    description: 'Precio del producto (máximo 10 enteros y 2 decimales)',
    example: 15000.50,
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe ser un número válido con máximo 2 decimales' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  precio_producto: number;

  @ApiProperty({
    description: 'Stock disponible del producto',
    example: 500,
  })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock_producto: number;

  @ApiProperty({
    description: 'Fecha de ingreso del producto (ISO 8601)',
    example: '2025-09-07T14:30:00.000Z',
  })
  @IsDateString({}, { message: 'La fecha de ingreso debe tener formato válido (ISO 8601)' })
  fecha_ingreso_producto: Date;

  @ApiProperty({
    description: 'Fecha de caducidad del producto (YYYY-MM-DD)',
    example: '2026-12-31',
  })
  @IsDateString({}, { message: 'La fecha de caducidad debe tener formato válido (YYYY-MM-DD)' })
  fecha_caducidad_producto: Date;

  @ApiProperty({
    description: 'ID del cultivo asociado',
    example: 1,
  })
  @IsInt({ message: 'El ID del cultivo debe ser numérico' })
  @IsNotEmpty({ message: 'Debe indicar el cultivo asociado' })
  id_cultivo_fk: number;
}
