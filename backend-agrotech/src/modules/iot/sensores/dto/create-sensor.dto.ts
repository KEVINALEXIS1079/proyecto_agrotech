import { IsString, IsDateString, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDto {
  @ApiProperty({
    description: 'Nombre del sensor',
    examples: ['Sensor de humedad', 'Sensor de temperatura'],
  })
  @IsString({ message: 'El nombre del sensor debe ser texto' })
  nombre_sensor: string;

  @ApiProperty({
    description: ' El valor minimo debe ser un numero',
    example: 20
  })
  @IsInt({ message: ' El valor minimo debe ser un numero'})
  valor_minimo: number


    @ApiProperty({
    description: ' El valor maximo debe ser un numero',
    example: 20
  })
  @IsInt({ message: ' El valor maximo debe ser un numero'})
  valor_maximo: number

  @ApiProperty({
    description: 'Fecha de inicio de funcionamiento del sensor',
    examples: ['2025-01-15', '2025-06-01'],
  })
  @IsDateString({}, { message: 'La fecha de instalación debe ser una fecha válida, con formato Año/Mes/día' })
  fecha_inicio_sensor: string;

  @ApiProperty({
    description: 'Fecha de finalización del sensor',
    examples: ['2026-01-15', '2025-12-31'],
  })
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida, con formato Año/Mes/día' })
  fecha_fin_sensor: string;

  @ApiProperty({
    description: 'ID del cultivo asociado',
    examples: [1, 5, 12],
  })
  @IsInt({ message: 'El id del cultivo debe ser un número entero' })
  @IsPositive()
  id_cultivo_fk: number;

  @ApiProperty({
    description: 'ID del tipo de sensor (ej. humedad, temperatura, pH)',
    examples: [2, 3],
  })
  @IsInt({ message: 'El id del tipo de sensor debe ser un número entero' })
  @IsPositive()
  id_tipo_sensor_fk: number;
}
