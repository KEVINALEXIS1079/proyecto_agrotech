import { 
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVentaDto {
  @ApiProperty({
    description: 'Cantidad de productos vendidos',
    example: 10,
  })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number;

  @ApiProperty({
    description: 'Precio unitario del producto vendido',
    example: 25000.50,
  })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0, { message: 'El precio unitario no puede ser negativo' })
  precio_unitario: number;

  @ApiProperty({
    description: 'Fecha de la venta (YYYY-MM-DD)',
    example: '2025-09-07',
  })
  @IsDateString({}, { message: 'La fecha debe estar en formato válido (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'La fecha no puede estar vacía' })
  fecha: Date;
}
