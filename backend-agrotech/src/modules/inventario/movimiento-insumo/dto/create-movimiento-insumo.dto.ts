import { IsInt, IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovimientoInsumoDto {
  @ApiProperty({
    description: 'ID del insumo asociado al movimiento',
    examples: [1, 5, 12],
  })
  @IsInt()
  id_insumo_fk: number;

  @ApiProperty({
    description: 'Tipo de movimiento realizado',
    examples: ['ENTRADA', 'SALIDA', 'AJUSTE'],
  })
  @IsString()
  @IsNotEmpty()
  tipo_movimiento: string;

  @ApiProperty({
    description: 'Cantidad de insumo movida',
    examples: [10, 50, 100],
  })
  @IsInt()
  cantidad: number;

  @ApiProperty({
    description: 'Unidad de medida de la cantidad',
    examples: ['kg', 'litros', 'unidades'],
  })
  @IsString()
  unidad: string;

  @ApiProperty({
    description: 'Fecha del movimiento',
    examples: ['2025-09-02', '2025-05-20'], // formato recomendado ISO string
  })
  @IsDate()
  fecha_movimiento: Date;

  @ApiProperty({
    description: 'Motivo del movimiento de insumo',
    examples: ['Compra', 'Consumo en campo', 'Devolución'],
  })
  @IsString()
  motivo: string;

  @ApiProperty({
    description: 'ID de la actividad relacionada (opcional)',
    required: false,
    examples: [3, 7],
  })
  @IsOptional()
  @IsInt()
  id_actividad_fk?: number;

  @ApiProperty({
    description: 'Observaciones adicionales (opcional)',
    required: false,
    examples: ['Urgente', 'Entrega parcial', 'Uso experimental'],
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
