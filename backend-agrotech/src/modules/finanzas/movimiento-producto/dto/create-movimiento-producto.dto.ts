import { 
  IsEnum,
  IsInt,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovimientoProductoDto {
  @ApiProperty({
    description: 'Tipo de movimiento del producto',
    enum: ['entrada', 'salida'],
    example: 'entrada',
  })
  @IsEnum(['entrada', 'salida'], { message: 'El tipo de movimiento debe ser ENTRADA o SALIDA' })
  tipo_movimiento: 'entrada' | 'salida';

  @ApiProperty({
    description: 'Cantidad del movimiento',
    example: 100,
  })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;

  @ApiProperty({
    description: 'Fecha del movimiento (ISO 8601)',
    example: '2025-09-07T15:00:00.000Z',
  })
  @IsDateString({}, { message: 'La fecha debe tener formato válido (ISO 8601)' })
  fecha: Date;

  @ApiProperty({
    description: 'Descripción del movimiento',
    example: 'Ingreso de fertilizantes',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser texto' })
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    description: 'ID del producto asociado',
    example: 1,
  })
  @IsInt({ message: 'El ID del producto debe ser numérico' })
  @IsNotEmpty({ message: 'Debe indicar el producto asociado' })
  id_producto_fk: number;

  @ApiProperty({
    description: 'ID de la venta asociada (opcional)',
    example: 10,
    required: false,
  })
  @IsInt({ message: 'El ID de la venta debe ser numérico' })
  @IsOptional()
  id_venta_fk?: number;
}
