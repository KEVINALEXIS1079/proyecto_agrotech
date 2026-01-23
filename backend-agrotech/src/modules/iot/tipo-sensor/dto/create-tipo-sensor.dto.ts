import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTipoSensorDto {
  @ApiProperty({
    description: 'Nombre del tipo de sensor',
    examples: ['Humedad', 'Temperatura', 'pH', 'Luminosidad'],
  })
  @IsString({ message: 'El nombre del tipo de sensor debe ser texto' })
  @IsNotEmpty({ message: 'El nombre del tipo de sensor no puede estar vacío' })
  nombre_tipo_sensor: string;

  @ApiPropertyOptional({
    description: 'Unidad de medida del tipo de sensor',
    examples: ['%', '°C', 'pH', 'lux'],
  })
  @IsString({ message: 'La unidad del tipo de sensor debe ser texto' })
  @IsOptional()
  unidades_tipo_sensor?: string;

  @ApiPropertyOptional({
    description: 'Cantidad de decimales que maneja el tipo de sensor',
    example: 2,
  })
  @IsInt({ message: 'Los decimales deben ser un número entero' })
  @IsOptional()
  decimales_tipo_sensor?: number;

  @ApiPropertyOptional({
    description: 'URL o nombre del archivo de imagen del tipo de sensor',
    example: 'temperatura.png',
  })
  @IsString({ message: 'La imagen del tipo de sensor debe ser texto' })
  @IsOptional()
  imagen_tipo_sensor?: string;
}
